import type { Currencies } from "@/types/storeTypes";

import { useFetchMiscBasic } from "@/services/misc";
import { useCurrencyStore } from "@/stores/currencyStore";
import { findNearestRate } from "@/utils/findNearestRate";
import { useMiscRate } from "./useMiscRate";

export const useGetMarketCurrency = (
  date?: Date,
  customCurrency?: Currencies,
) => {
  const { currency } = useCurrencyStore();

  const { data: miscBasic } = useFetchMiscBasic();
  const rates = useMiscRate(miscBasic?.data.version.rate);

  const data = miscBasic?.data?.rate;

  const rate = findNearestRate(date, rates);
  let fiat;
  let adaUsdClose;
  let btcUsdClose;

  if (data?.ada[0]?.close && data?.fiat) {
    fiat = data?.fiat;
    adaUsdClose = data?.ada[0]?.close;
    btcUsdClose = data?.btc[0]?.close;
  } else {
    fiat = miscBasic?.data.rate.fiat;
    adaUsdClose = rate?.adausd;
    btcUsdClose = rate?.btcusd;
  }

  if (!fiat || !adaUsdClose) return {};

  const currentCurrency = fiat[customCurrency ?? currency];
  const usdToCzk = fiat["usd"];

  if (!currentCurrency || !adaUsdClose || !usdToCzk) {
    return {};
  }

  const [rateInCzk, scaleForCurrency] = currentCurrency;
  const [rateUsdInCzk, scaleUsd] = usdToCzk;

  const rateInUsd = rateInCzk / scaleForCurrency / (rateUsdInCzk / scaleUsd);
  const currencyInAda = rateInUsd / adaUsdClose;

  return {
    [currency]: 1,
    ada: currencyInAda,
    adaUsdClose,
    btcUsdClose,
  };
};
