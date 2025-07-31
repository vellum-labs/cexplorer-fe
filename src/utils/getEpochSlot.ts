import {
  epochLength,
  epochStart,
  slotDurationByron,
} from "@/constants/confVariables";
import { formatNumber } from "./format/format";

export const getEpochSlot = (blockSlot: number, epoch_no: number) => {
  const slotNumber = blockSlot - epochStart * slotDurationByron;

  if (epoch_no <= epochStart) {
    return formatNumber(slotNumber);
  }

  return formatNumber(slotNumber - (epoch_no - epochStart) * epochLength);
};
