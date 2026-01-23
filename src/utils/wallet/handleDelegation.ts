import type { BrowserWallet } from "@meshsdk/core";
import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";
import { donationAddress } from "@/constants/confVariables";
import { validateDonationNetwork } from "./validateDonationNetwork";

interface DelegationParams {
  type: "pool" | "drep";
  ident: string;
  donation?: boolean;
  donationAmount?: number;
}

export const handleDelegation = async (
  params: DelegationParams,
  wallet: BrowserWallet | null,
) => {
  if (!wallet) {
    callDelegationToast({
      errorMessage: "Wallet not connected. Please connect your wallet first.",
    });
    return;
  }

  const delegationId = params.ident;
  const idLabel = params.type === "pool" ? "poolId" : "DRep ID";

  if (!delegationId) {
    callDelegationToast({ errorMessage: `Missing ${idLabel}.` });
    return;
  }

  const rewardAddresses = await wallet.getRewardAddresses();
  const rewardAddress = rewardAddresses?.[0];
  if (!rewardAddress) {
    callDelegationToast({ errorMessage: "No reward address from wallet." });
    return;
  }

  const utxos = await wallet.getUtxos();
  if (!utxos || !utxos.length) {
    callDelegationToast({
      errorMessage:
        "Wallet has no UTxOs. Fund the wallet (deposit + fees required).",
    });
    return;
  }

  try {
    if (params.donationAmount && params.donationAmount > 0) {
      const networkCheck = await validateDonationNetwork(wallet);
      if (!networkCheck.valid) {
        callDelegationToast({ errorMessage: networkCheck.message });
        return;
      }
    }

    const apiKey = import.meta.env.VITE_APP_BLOCKFROST_KEY;

    const provider = new BlockfrostProvider(apiKey);
    const changeAddress = await wallet.getChangeAddress();

    const buildTransaction = async (includeRegistration: boolean) => {
      const innerTxBuilder = new MeshTxBuilder({
        fetcher: provider,
        evaluator: provider,
      });

      if (includeRegistration) {
        innerTxBuilder.registerStakeCertificate(rewardAddress);
      }

      if (params.type === "pool") {
        innerTxBuilder.delegateStakeCertificate(rewardAddress, delegationId);
      } else {
        if (delegationId === "drep_always_abstain") {
          innerTxBuilder.voteDelegationCertificate(
            { alwaysAbstain: null },
            rewardAddress,
          );
        } else if (delegationId === "drep_always_no_confidence") {
          innerTxBuilder.voteDelegationCertificate(
            { alwaysNoConfidence: null },
            rewardAddress,
          );
        } else {
          innerTxBuilder.voteDelegationCertificate(
            { dRepId: delegationId },
            rewardAddress,
          );
        }
      }

      if (params.donationAmount && params.donationAmount > 0) {
        const donationLovelace = params.donationAmount * 1_000_000;
        innerTxBuilder.txOut(donationAddress, [
          { unit: "lovelace", quantity: donationLovelace.toString() },
        ]);
      }

      return innerTxBuilder
        .selectUtxosFrom(utxos)
        .changeAddress(changeAddress)
        .complete();
    };

    const isStakeNotRegisteredError = (error: any): boolean => {
      const errorStr = JSON.stringify(error);
      return (
        errorStr.includes("StakeKeyNotRegisteredDELEG") ||
        errorStr.includes("unknown stake credential") ||
        errorStr.includes("not registered")
      );
    };

    const submitWithRetry = async (
      includeRegistration: boolean,
    ): Promise<string> => {
      const unsignedTx = await buildTransaction(includeRegistration);
      const signedTx = await wallet.signTx(unsignedTx);
      return wallet.submitTx(signedTx);
    };

    let hash: string;
    try {
      hash = await submitWithRetry(false);
    } catch (e: any) {
      if (isStakeNotRegisteredError(e)) {
        hash = await submitWithRetry(true);
      } else {
        throw e;
      }
    }

    const trackingId =
      params.type === "pool"
        ? params.donation
          ? "donation_page"
          : delegationId
        : `drep_${delegationId}`;

    sendDelegationInfo(hash, trackingId);

    callDelegationToast({ success: true });
    return hash;
  } catch (e: any) {
    const errorString = JSON.stringify(e);
    const errorMessage = e?.message || "";
    const errorInfo = e?.cause?.failure?.cause?.info || "";

    if (
      errorString.includes("user declined signing") ||
      errorString.includes("TxSignError") ||
      errorString.includes("DataSignError") ||
      errorInfo.includes("user declined signing") ||
      errorMessage.includes("user declined") ||
      errorMessage.includes("cancelled") ||
      errorMessage.includes("rejected")
    ) {
      callDelegationToast({
        errorMessage: "Transaction cancelled by user",
      });
      return;
    }

    if (
      errorString.includes("ledger") ||
      errorString.includes("hardware") ||
      errorMessage.includes("device not found") ||
      errorMessage.includes("connection")
    ) {
      callDelegationToast({
        errorMessage:
          "Hardware wallet connection issue. Please check your device connection.",
      });
      return;
    }

    let friendlyMessage =
      params.type === "pool"
        ? "Delegation failed. Please try again."
        : "DRep delegation failed. Please try again.";

    if (errorMessage) {
      friendlyMessage = errorMessage;
    } else if (errorInfo) {
      friendlyMessage = errorInfo;
    }

    callDelegationToast({
      errorMessage: friendlyMessage,
    });
  }
};
