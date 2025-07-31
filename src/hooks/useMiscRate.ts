import { useFetchMiscRate } from "@/services/misc";
import { useRateStore } from "@/stores/rateStore";

export const useMiscRate = (basicVersion: number | undefined) => {
  const { rate } = useRateStore();

  const query = useFetchMiscRate(basicVersion);

  if (query.isSuccess) {
    return query.data?.data.rates;
  }

  return rate;
};
