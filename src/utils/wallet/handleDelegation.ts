import type { JobCardano } from "@jamonbread/sdk";
import { callDelegationToast } from "../error/callDelegationToast";

export const handleDelegation = async (
  poolId: string,
  job: JobCardano | null,
) => {
  if (!job || !job.lucid) return;

  const rewardAddress = await job.lucid.wallet.rewardAddress();
  if (!rewardAddress) return;

  try {
    const delegation = await job.lucid.provider.getDelegation(rewardAddress);

    let txBuilder = job.lucid.newTx();

    if (!delegation || !delegation?.poolId) {
      txBuilder = txBuilder.registerStake(rewardAddress);
    }

    const txComplete = await txBuilder
      .delegateTo(rewardAddress, poolId)
      .complete();

    const signedTx = await txComplete.sign().complete();
    const txHash = await signedTx.submit();

    callDelegationToast({
      success: true,
    });

    await job.lucid.awaitTx(txHash);
  } catch (e: any) {
    console.error("Delegation error:", e);
    callDelegationToast({
      errorMessage: String(e).replace("Error:", ""),
    });
  }
};
