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

    const txBuilder = job.lucid.newTx();

    const needsRegistration =
      !delegation || (delegation.poolId === null && delegation.rewards === 0n);

    if (needsRegistration) {
      txBuilder.registerStake(rewardAddress);
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
      errorMessage: JSON.stringify(e).replace("Error:", ""),
    });
  }
};
