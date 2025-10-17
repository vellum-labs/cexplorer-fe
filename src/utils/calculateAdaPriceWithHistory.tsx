import type { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";

import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";

export const calculateAdaPriceWithHistory = (
  lovelace: number,
  adaPriceData: ReturnType<typeof useAdaPriceWithHistory>,
): [string, number, number, number] => {
  const { todayValue, adaToSats, percentChange } = adaPriceData;

  if (!todayValue || !adaToSats) {
    return [`₳ ${formatNumberWithSuffix(lovelace / 1e6)}`, 0, 0, 0];
  }

  const ada = lovelace / 1e6;
  const usd = ada * todayValue;
  const btc = ada * adaToSats * 1e-8;
  const percent = percentChange || 0;

  return [`₳ ${formatNumberWithSuffix(ada)}`, usd, btc, percent];
};
