import type { BrowserWallet } from "@meshsdk/core";
import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";
import { donationAddress } from "@/constants/confVariables";

const validateDonationNetwork = async (
  wallet: BrowserWallet,
): Promise<{ valid: boolean; message?: string }> => {
  try {
    const networkId = await wallet.getNetworkId();
    const isMainnetWallet = networkId === 1;
    const isMainnetAddress = donationAddress.startsWith("addr1q");
    const isTestnetAddress = donationAddress.startsWith("addr_test");

    if (!isMainnetWallet && isMainnetAddress) {
      return {
        valid: false,
        message:
          "Network mismatch: Wallet is on Testnet but donation address is for Mainnet.",
      };
    }

    if (isMainnetWallet && (isTestnetAddress || !isMainnetAddress)) {
      return {
        valid: false,
        message:
          "Network mismatch: Wallet is on Mainnet but donation address is for Testnet.",
      };
    }
  } catch (error) {
    console.error("Network check error:", error);
  }

  return { valid: true };
};

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

    const isStakeAlreadyRegisteredError = (error: any): boolean => {
      const errorStr = JSON.stringify(error);
      return (
        errorStr.includes("StakeKeyRegisteredDELEG") ||
        errorStr.includes("already registered") ||
        errorStr.includes("KeyDeposit")
      );
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
      console.log("Building transaction...", {
        includeRegistration,
        donationAmount: params.donationAmount,
        donationAddress,
      });
      const unsignedTx = await buildTransaction(includeRegistration);
      console.log("Transaction built, signing...");
      const signedTx = await wallet.signTx(unsignedTx);
      console.log("Transaction signed, submitting...");
      return wallet.submitTx(signedTx);
    };

    let hash: string;
    try {
      hash = await submitWithRetry(false);
    } catch (e: any) {
      if (isStakeNotRegisteredError(e)) {
        console.log("Stake not registered, retrying with registration");
        try {
          hash = await submitWithRetry(true);
        } catch (retryError: any) {
          if (isStakeAlreadyRegisteredError(retryError)) {
            console.log(
              "Conflicting state: chain says both registered and not registered",
            );
          }
          throw retryError;
        }
      } else if (isStakeAlreadyRegisteredError(e)) {
        console.log(
          "Stake already registered, but we didn't include registration cert",
        );
        throw e;
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
    console.error(
      `${params.type === "pool" ? "Pool" : "DRep"} delegation error:`,
      e,
    );
    console.error("Error details:", {
      message: e?.message,
      cause: e?.cause,
      stack: e?.stack,
      fullError: JSON.stringify(e, null, 2),
    });

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
