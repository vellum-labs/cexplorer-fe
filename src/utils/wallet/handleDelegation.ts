import type { LucidEvolution } from "@lucid-evolution/lucid";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";

export const handleDelegation = async (
  poolId: string,
  lucid: LucidEvolution | null,
  donation: boolean = false,
) => {
  if (!lucid) return;

  if (!poolId) {
    callDelegationToast({ errorMessage: "Missing poolId." });
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

    tx.delegate.ToPool(rewardAddress, poolId);

    const complete = await tx.complete();
    const signed = await complete.sign.withWallet();
    const signedTx = await signed.complete();
    const hash = await signedTx.submit();

    sendDelegationInfo(hash, donation ? "donation_page" : poolId);

    callDelegationToast({ success: true });
    await lucid.awaitTx(hash);
    return hash;
  } catch (e: any) {
    console.error("Delegation error:", e);

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

    let friendlyMessage = "Delegation failed. Please try again.";

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
