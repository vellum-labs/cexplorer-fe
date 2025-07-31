import type { JobCardano } from "@jamonbread/sdk";

export const handleDelegation = async (
  poolId: string,
  job: JobCardano | null,
) => {
  if (!job || !job.lucid) return;

  const rewardAddress = await job.lucid.wallet.rewardAddress();
  if (!rewardAddress) return;

  const tx = job.lucid.newTx();

  try {
    const txComplete = await tx.delegateTo(rewardAddress, poolId).complete();
    const signedTx = await txComplete.sign().complete();
    const txHash = await signedTx.submit();
    await job.lucid.awaitTx(txHash);
  } catch (e: any) {
    console.log("error", e);
  }
};
