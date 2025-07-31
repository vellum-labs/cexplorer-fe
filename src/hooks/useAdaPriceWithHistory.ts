import type { Currencies } from "@/types/storeTypes";

import { currencySigns } from "@/constants/currencies";
import { useFetchMiscBasic } from "@/services/misc";
import { useCurrencyStore } from "@/stores/currencyStore";

export const useAdaPriceWithHistory = (overrideCurrency?: Currencies) => {
  const { currency: storeCurrency } = useCurrencyStore();
  const currency = overrideCurrency || storeCurrency;

  const { data: miscBasic } = useFetchMiscBasic();

  if (
    !Array.isArray(miscBasic?.data?.rate?.ada) ||
    !Array.isArray(miscBasic?.data?.rate?.btc) ||
    !Array.isArray(miscBasic?.data?.rate_day?.ada)
  ) {
    return {};
  }

  const adaTodayRecord = miscBasic?.data?.rate?.ada?.find(
    entry => entry?.close !== undefined && typeof entry.close === "number",
  );

  const btcTodayRecord = miscBasic?.data?.rate?.btc?.find(
    entry => entry?.close !== undefined && typeof entry.close === "number",
  );

  const adaYesterdayRecord = miscBasic?.data?.rate_day?.ada?.find(
    entry => entry?.close !== undefined && typeof entry.close === "number",
  );

  const fiatRates = miscBasic?.data?.rate?.fiat;
  const currentCurrency = fiatRates?.[currency];
  const usdCurrency = fiatRates?.["usd"];

  const isDataValid =
    adaTodayRecord &&
    btcTodayRecord &&
    adaYesterdayRecord &&
    currentCurrency &&
    usdCurrency;

  if (!isDataValid) {
    return {};
  }

  const adaUsdClose = adaTodayRecord.close!;
  const btcUsdClose = btcTodayRecord.close!;
  const yesterdayRate = adaYesterdayRecord.close!;
  const [rateInCzk, scaleForCurrency] = currentCurrency;
  const [rateUsdInCzk, scaleUsd] = usdCurrency;

  const rateInUsd = rateInCzk / scaleForCurrency / (rateUsdInCzk / scaleUsd);
  const adaToBtc = adaUsdClose / btcUsdClose;
  const adaToSats = adaToBtc * 1e8;

  const todayAda = rateInUsd / adaUsdClose;
  const yesterdayAda = rateInUsd / yesterdayRate;

  const percentChange =
    Math.abs(((todayAda - yesterdayAda) / yesterdayAda) * 100) *
    (yesterdayRate > adaUsdClose ? -1 : 1);

  return {
    todayValue: scaleForCurrency / todayAda,
    adaToSats,
    today: currencySigns[currency] + (scaleForCurrency / todayAda).toFixed(2),
    yesterday:
      currencySigns[currency] + (scaleForCurrency / yesterdayAda).toFixed(2),
    percentChange,
  };
};
