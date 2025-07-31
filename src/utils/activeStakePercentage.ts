export const activeStakePercentage = (
  live_stake: number,
  circulatingSupply: number,
  optimalPoolCount: number,
): [number, number] => {
  const optimalPoolSize = circulatingSupply / optimalPoolCount;
  const poolCapUsed = (live_stake / optimalPoolSize) * 100;

  return [optimalPoolSize, poolCapUsed];
};
