import type { JobCardano } from "@jamonbread/sdk";
import { callDelegationToast } from "../error/callDelegationToast";

export const handleDelegation = async (
  poolId: string,
  job: JobCardano | null,
  isStakeRegistered: boolean = false,
) => {
  if (!job?.lucid) return;
  const lucid = job.lucid;

  if (!poolId) {
    callDelegationToast({ errorMessage: "Missing poolId." });
    return;
  }

  const rewardAddress = await lucid.wallet.rewardAddress();
  if (!rewardAddress) {
    callDelegationToast({ errorMessage: "No reward address from wallet." });
    return;
  }

  const utxos = await lucid.wallet.getUtxos();
  if (!utxos.length) {
    callDelegationToast({
      errorMessage:
        "Wallet has no UTxOs. Fund the wallet (deposit + fees required).",
    });
    return;
  }

  try {
    const tx = lucid.newTx();

    if (!isStakeRegistered) {
      tx.registerStake(rewardAddress);
    }

    tx.delegateTo(rewardAddress, poolId);

    const complete = await tx.complete();
    const signed = await complete.sign().complete();
    const hash = await signed.submit();

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
