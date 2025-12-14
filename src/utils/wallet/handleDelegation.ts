import type { BrowserWallet } from "@meshsdk/core";
import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";

interface DelegationParams {
  type: "pool" | "drep";
  ident: string;
  donation?: boolean;
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
    const apiKey = import.meta.env.VITE_APP_BLOCKFROST_KEY;

    const provider = new BlockfrostProvider(apiKey);
    const changeAddress = await wallet.getChangeAddress();

    const txBuilder = new MeshTxBuilder({
      fetcher: provider,
      evaluator: provider,
    });

    // Check if stake key is registered by querying account info
    let stakeKeyRegistered = false;
    try {
      const accountInfo = await provider.fetchAccountInfo(rewardAddress);
      stakeKeyRegistered = accountInfo !== null && accountInfo !== undefined;
    } catch {
      // If we can't fetch account info, assume not registered
      stakeKeyRegistered = false;
    }

    // Register stake key if not registered
    if (!stakeKeyRegistered) {
      txBuilder.registerStakeCertificate(rewardAddress);
    }

    if (params.type === "pool") {
      // Pass pool ID directly - MeshJS will handle deserialization internally
      txBuilder.delegateStakeCertificate(rewardAddress, delegationId);
    } else {
      // DRep delegation
      if (delegationId === "drep_always_abstain") {
        txBuilder.voteDelegationCertificate(
          {
            alwaysAbstain: null,
          },
          rewardAddress,
        );
      } else if (delegationId === "drep_always_no_confidence") {
        txBuilder.voteDelegationCertificate(
          {
            alwaysNoConfidence: null,
          },
          rewardAddress,
        );
      } else {
        txBuilder.voteDelegationCertificate(
          {
            dRepId: delegationId,
          },
          rewardAddress,
        );
      }
    }

    const unsignedTx = await txBuilder
      .selectUtxosFrom(utxos)
      .changeAddress(changeAddress)
      .complete();

    const signedTx = await wallet.signTx(unsignedTx);
    const hash = await wallet.submitTx(signedTx);

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
