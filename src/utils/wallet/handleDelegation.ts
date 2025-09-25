import type { LucidEvolution } from "@lucid-evolution/lucid";
import { callDelegationToast } from "../error/callDelegationToast";
import { sendDelegationInfo } from "@/services/tool";

export const handleDelegation = async (
  poolId: string,
  lucid: LucidEvolution | null,
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

    sendDelegationInfo(hash, poolId);

    callDelegationToast({ success: true });
    await lucid.awaitTx(hash);
    return hash;
  } catch (e: any) {
    console.error("Delegation error:", e);
    callDelegationToast({
      errorMessage: JSON.stringify(e).replace("Error:", ""),
    });
  }
};
