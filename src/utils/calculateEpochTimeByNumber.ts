import { epochLength } from "@/constants/confVariables";
import { toUtcDate } from "./format/format";

export const calculateEpochTimeByNumber = (
  epoch: number,
  currentEpochNumber: number,
  startTime: string,
) => {
  if (epoch === currentEpochNumber) {
    return {
      startTime: new Date(toUtcDate(startTime)),
      endTime: new Date(
        new Date(toUtcDate(startTime)).getTime() + epochLength * 1000,
      ),
    };
  }

  const currentEpochStartTime = new Date(toUtcDate(startTime));
  const currentEpochEndTime = new Date(
    new Date(toUtcDate(startTime)).getTime() + epochLength * 1000,
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
