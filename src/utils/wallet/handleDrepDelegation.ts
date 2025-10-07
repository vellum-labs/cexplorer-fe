import type { LucidEvolution } from "@lucid-evolution/lucid";
import { drepIDToCredential } from "@lucid-evolution/utils";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";

export const handleDrepDelegation = async (
  drepId: string,
  lucid: LucidEvolution | null,
) => {
  if (!lucid) return;

  if (!drepId) {
    callDelegationToast({ errorMessage: "Missing DRep ID." });
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

    const drep =
      drepId === "drep_always_abstain"
        ? { __typename: "AlwaysAbstain" as const }
        : drepId === "drep_always_no_confidence"
          ? { __typename: "AlwaysNoConfidence" as const }
          : drepIDToCredential(drepId);

    tx.delegate.VoteToDRep(rewardAddress, drep);

    const complete = await tx.complete();
    const signed = await complete.sign.withWallet();
    const signedTx = await signed.complete();
    const hash = await signedTx.submit();

    sendDelegationInfo(hash, `drep_${drepId}`);

    callDelegationToast({ success: true });
    await lucid.awaitTx(hash);
    return hash;
  } catch (e: any) {
    console.error("DRep delegation error:", e);

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

    let friendlyMessage = "DRep delegation failed. Please try again.";

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
