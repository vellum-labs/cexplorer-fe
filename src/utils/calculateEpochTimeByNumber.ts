import { epochLength } from "@/constants/confVariables";

export const calculateEpochTimeByNumber = (
  epoch: number,
  currentEpochNumber: number,
  startTime: string,
) => {
  if (epoch === currentEpochNumber) {
    return {
      startTime: new Date(startTime),
      endTime: new Date(new Date(startTime).getTime() + epochLength * 1000),
    };
  }

  const currentEpochStartTime = new Date(startTime);
  const currentEpochEndTime = new Date(
    new Date(startTime).getTime() + epochLength * 1000,
  );

  const epochDurationMs =
    currentEpochEndTime.getTime() - currentEpochStartTime.getTime();

  const epochOffset = epoch - currentEpochNumber;

  const newEpochStartTime = new Date(
    currentEpochStartTime.getTime() + epochOffset * epochDurationMs,
  );
  const newEpochEndTime = new Date(
    currentEpochEndTime.getTime() + epochOffset * epochDurationMs,
  );

  return { startTime: newEpochStartTime, endTime: newEpochEndTime };
};
