import { epochLength } from "@/constants/confVariables";
import { toUtcDate } from "@vellumlabs/cexplorer-sdk";

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

export const getEpochTimestamp = (
  epochNo: number,
  currentEpochNo: number | undefined,
  currentEpochStartTime: string | undefined,
): string | null => {
  if (!currentEpochNo || !currentEpochStartTime) {
    return null;
  }
  try {
    const { startTime } = calculateEpochTimeByNumber(
      epochNo,
      currentEpochNo,
      currentEpochStartTime,
    );
    if (startTime && !isNaN(startTime.getTime())) {
      const year = startTime.getUTCFullYear();
      const month = String(startTime.getUTCMonth() + 1).padStart(2, "0");
      const day = String(startTime.getUTCDate()).padStart(2, "0");
      const hours = String(startTime.getUTCHours()).padStart(2, "0");
      const minutes = String(startTime.getUTCMinutes()).padStart(2, "0");
      const seconds = String(startTime.getUTCSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
  } catch {
    return null;
  }
  return null;
};
