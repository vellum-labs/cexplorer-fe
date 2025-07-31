import type { PoolsListResponseDataItem } from "@/types/poolTypes";

export const calculateAPY = (poolData: PoolsListResponseDataItem) => {
  const epochs = poolData.epochs;
  let totalStake = 0;
  let totalRewards = 0;
  const epochCount = Object.keys(epochs).length;

  for (const epochId in epochs) {
    const epochData = epochs[epochId]?.data;

    if (epochData) {
      totalStake += epochData.epoch_stake;
      totalRewards += epochData.reward.member_lovelace;
    }
  }

  const averageStake = totalStake / epochCount;
  const averageRewards = totalRewards / epochCount;

  const apy = (averageRewards / averageStake) * (365 / 40) * 100;
  return apy;
};
