import { epochLength } from "@/constants/confVariables";
import type { MiscConstResponseData } from "@/types/miscTypes";

export const useElapsedEpochNumber = (
  miscConst: MiscConstResponseData | undefined,
): number => {
  if (!miscConst) return 0;

  const startTime = new Date(miscConst.epoch.start_time).getTime();
  const endTime = startTime + epochLength * 1000;
  const currentTime = Date.now();

  if (currentTime >= endTime) {
    return 1;
  } else if (currentTime <= startTime) {
    return 0;
  } else {
    const elapsed = currentTime - startTime;
    const total = endTime - startTime;
    return parseFloat((elapsed / total).toFixed(2));
  }
};
