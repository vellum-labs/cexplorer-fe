import type { TreasuryDonationStatsEpoch } from "@/types/treasuryTypes";

export const findNearestTreasuryRate = (
  epochs: TreasuryDonationStatsEpoch[] | undefined,
  epoch_no: number = 0,
): TreasuryDonationStatsEpoch["rate"]["ada"] => {
  if (!epochs) return [];

  const getNearestAdaArray = (
    index: number,
  ): TreasuryDonationStatsEpoch["rate"]["ada"] => {
    let left = index - 1;
    let right = index + 1;

    while (left >= 0 || right < epochs.length) {
      if (left >= 0 && epochs[left].rate.ada.length > 0) {
        return epochs[left].rate.ada;
      }
      if (right < epochs.length && epochs[right].rate.ada.length > 0) {
        return epochs[right].rate.ada;
      }
      left--;
      right++;
    }

    return [];
  };

  const startIndex = epochs.findIndex(epoch => epoch.epoch_no === epoch_no);
  if (startIndex === -1) return [];

  if (epochs[startIndex].rate.ada.length > 0) {
    return epochs[startIndex].rate.ada;
  }

  return getNearestAdaArray(startIndex);
};
