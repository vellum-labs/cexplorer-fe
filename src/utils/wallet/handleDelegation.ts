import type { LucidEvolution } from "@lucid-evolution/lucid";
import { drepIDToCredential } from "@lucid-evolution/utils";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";

interface DelegationParams {
  type: "pool" | "drep";
  ident: string;
  donation?: boolean;
}

export const handleDelegation = async (
  params: DelegationParams,
  lucid: LucidEvolution | null,
) => {
  if (!lucid) return;

  const delegationId = params.ident;
  const idLabel = params.type === "pool" ? "poolId" : "DRep ID";

  if (!delegationId) {
    callDelegationToast({ errorMessage: `Missing ${idLabel}.` });
    return;
  }

  const rewardAddress = await lucid.wallet().rewardAddress();
  if (!rewardAddress) {
    callDelegationToast({ errorMessage: "No reward address from wallet." });
    return;
  }

  const utxos = await lucid.wallet().getUtxos();
  if (!utxos.length) {
    callDelegationToast({
      errorMessage:
        "Wallet has no UTxOs. Fund the wallet (deposit + fees required).",
    });
    return;
  }

  try {
    const delegation = await lucid.wallet().getDelegation();

    const stakeKeyRegistered = !delegation || delegation?.poolId === null;

    const tx = lucid.newTx();

    if (stakeKeyRegistered) {
      tx.register.Stake(rewardAddress);
    }

    if (params.type === "pool") {
      tx.delegate.ToPool(rewardAddress, delegationId);
    } else {
      const drep =
        delegationId === "drep_always_abstain"
          ? { __typename: "AlwaysAbstain" as const }
          : delegationId === "drep_always_no_confidence"
            ? { __typename: "AlwaysNoConfidence" as const }
            : drepIDToCredential(delegationId);

      tx.delegate.VoteToDRep(rewardAddress, drep);
    }

    const complete = await tx.complete();
    const signed = await complete.sign.withWallet();
    const signedTx = await signed.complete();
    const hash = await signedTx.submit();

    const trackingId =
      params.type === "pool"
        ? params.donation
          ? "donation_page"
          : delegationId
        : `drep_${delegationId}`;

    sendDelegationInfo(hash, trackingId);

    callDelegationToast({ success: true });
    await lucid.awaitTx(hash);
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
