import { configJSON } from "@/constants/conf";

export const getEpochByTime = (
  txTime: number,
  currentEpochStartTime: number,
  currentEpochNumber: number,
) => {
  const { genesisParams } = configJSON;
  const epochLength = genesisParams[0]?.shelley[0].epochLength;

  let txTimeSec = txTime;
  if (txTime > 1e12) {
    txTimeSec = txTime / 1000;
  }

  const timeDiff = txTimeSec - currentEpochStartTime;

  if (timeDiff >= 0) {
    const additionalEpochs = Math.floor(timeDiff / epochLength);
    return currentEpochNumber + additionalEpochs;
  } else {
    const epochsBefore = Math.floor(Math.abs(timeDiff) / epochLength) + 1;
    return currentEpochNumber - epochsBefore;
  }
};
