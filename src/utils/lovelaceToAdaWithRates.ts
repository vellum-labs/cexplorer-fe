import type { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { formatNumberWithSuffix } from "./format/format";

export const lovelaceToAdaWithRates = (
  lovelace: number,
  currencyMarket: ReturnType<typeof useGetMarketCurrency>,
): [string, number, number, number] => {
  const usdRate = currencyMarket?.adaUsdClose;
  const btcRate = currencyMarket?.btcUsdClose;
  const currentCurrency = currencyMarket?.ada;

  const ada = lovelace / 1e6;
  const usd = usdRate ? ada * usdRate : 0;
  const btc = btcRate ? +usd / btcRate : 0;
  const current = currentCurrency ? ada / currentCurrency : 0;

  return [`₳ ${formatNumberWithSuffix(ada)}`, current, btc, usd];
};
