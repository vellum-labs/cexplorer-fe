export const slotToDate = (
  slot: number,
  epochStartSlot: number,
  epochStartTime: string,
) => {
  if (!epochStartTime || !epochStartSlot) return new Date();

  const startTime = new Date(epochStartTime).getTime() / 1000;
  const slotStart = epochStartSlot;
  const SECONDS_PER_SLOT = 1;

  const timeSinceEpochStart = (slot - slotStart) * SECONDS_PER_SLOT;
  const timestamp = startTime + timeSinceEpochStart;
  return new Date(timestamp * 1000);
};

export const calculateLoyaltyDays = (
  slotUpdate: number,
  currentSlot: number,
) => {
  const SECONDS_PER_SLOT = 1;
  const SECONDS_PER_DAY = 24 * 60 * 60;

  const slotsDifference = currentSlot - slotUpdate;
  const daysDifference = (slotsDifference * SECONDS_PER_SLOT) / SECONDS_PER_DAY;

  return daysDifference < 0 ? 0 : Math.floor(daysDifference);
};
