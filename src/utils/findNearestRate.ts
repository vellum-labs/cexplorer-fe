import type { BasicRate } from "@/types/miscTypes";

export function findNearestRate(
  date: string | Date | undefined,
  rates: BasicRate[],
): BasicRate | null {
  const targetDate = date
    ? typeof date === "string"
      ? date.includes(" ")
        ? date.split(" ")[0]
        : date.split("T")[0]
      : date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const targetIndex = rates.findIndex(obj => obj.date === targetDate);

  if (
    targetIndex !== -1 &&
    rates[targetIndex].adausd &&
    rates[targetIndex].btcusd
  ) {
    return rates[targetIndex];
  }

  let nearestRate: BasicRate | null = null;
  let minDiff = Infinity;

  for (let i = 0; i < rates.length; i++) {
    const rateDate = rates[i].date;
    const diff = Math.abs(
      new Date(rateDate).getTime() - new Date(targetDate).getTime(),
    );

    if (rates[i].adausd && rates[i].btcusd && diff < minDiff) {
      nearestRate = rates[i];
      minDiff = diff;
    }
  }

  return nearestRate;
}
