import {
  epochLength,
  epochStart,
  slotDurationByron,
} from "@/constants/confVariables";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const getEpochSlot = (blockSlot: number, epoch_no: number) => {
  if (epoch_no < epochStart) {
    return formatNumber(blockSlot % (epochLength * slotDurationByron));
  }

  const epochSlot = blockSlot % epochLength;

  return formatNumber(epochSlot);
};
