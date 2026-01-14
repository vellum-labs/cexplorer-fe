import type { FC } from "react";
import { useMemo, useCallback, useEffect, useState } from "react";
import { useFetchAccountRewardsPaginated } from "@/services/account";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  LoadingSkeleton,
} from "@vellumlabs/cexplorer-sdk";
import { currencies } from "@vellumlabs/cexplorer-sdk";
import type { Currencies } from "@/types/storeTypes";
import { SummaryTable } from "../components/SummaryTable";
import { EpochRewardsTable } from "../components/EpochRewardsTable";
import { useTaxToolPreferencesStore } from "@/stores/taxToolPreferencesStore";
import { useTaxToolEpochRewardsTableStore } from "@/stores/tables/taxToolEpochRewardsTableStore";

interface RewardsTabProps {
  stakeKey: string;
}

export const RewardsTab: FC<RewardsTabProps> = ({ stakeKey }) => {
  const { t } = useAppTranslation("common");
  const { secondaryCurrency, setSecondaryCurrency } =
    useTaxToolPreferencesStore();
  const {
    cachedSummary,
    setCachedSummary,
    lastStakeKey,
    setLastStakeKey,
    rows: storedRows,
    setRows: setStoredRows,
  } = useTaxToolEpochRewardsTableStore();
  const [page, setPage] = useState(1);

  const SUMMARY_LIMIT = 100;
  const itemsPerPage = storedRows;
  const offset = (page - 1) * itemsPerPage;
  const isValidStakeKey = stakeKey && isValidAddress(stakeKey);

  const adaPriceSecondary = useAdaPriceWithHistory(secondaryCurrency);

  const summaryQuery = useFetchAccountRewardsPaginated(
    SUMMARY_LIMIT,
    0,
    isValidStakeKey ? stakeKey : "",
  );

  const summaryRewards = useMemo(() => {
    if (!summaryQuery.data?.data) return [];
    return summaryQuery.data.data;
  }, [summaryQuery.data]);

  const epochQuery = useFetchAccountRewardsPaginated(
    itemsPerPage,
    offset,
    isValidStakeKey ? stakeKey : "",
  );

  const epochRewards = useMemo(() => {
    if (!epochQuery.data?.data) return [];
    return epochQuery.data.data;
  }, [epochQuery.data]);

  const isDataTruncated = summaryQuery.data?.count === SUMMARY_LIMIT;

  const getAdaUsdRate = useCallback((reward: any): number => {
    if (
      !reward.spendable_epoch?.rate ||
      !Array.isArray(reward.spendable_epoch.rate)
    ) {
      return 0;
    }

    const rateData = reward.spendable_epoch.rate[0];
    if (
      !rateData?.ada ||
      !Array.isArray(rateData.ada) ||
      rateData.ada.length === 0
    ) {
      return 0;
    }

    return rateData.ada[0]?.close || 0;
  }, []);

  const getAdaSecondaryRate = useCallback(
    (reward: any): number => {
      if (secondaryCurrency === "usd") {
        return getAdaUsdRate(reward);
      }

      const rateData = reward.spendable_epoch?.rate?.[0];
      const fiatRates = rateData?.fiat;

      if (fiatRates) {
        const secondaryFiat = fiatRates[secondaryCurrency];
        const usdFiat = fiatRates["usd"];

        if (secondaryFiat && usdFiat) {
          const [secondaryToCzk, secondaryScale] = secondaryFiat;
          const [usdToCzk, usdScale] = usdFiat;

          const adaUsdRate = getAdaUsdRate(reward);
          if (!adaUsdRate) return adaPriceSecondary.todayValue || 0;

          const usdRate = usdToCzk / usdScale;
          const secondaryRate = secondaryToCzk / secondaryScale;
          const adaSecondaryRate = adaUsdRate * (usdRate / secondaryRate);

          return adaSecondaryRate;
        }
      }

      return adaPriceSecondary.todayValue || 0;
    },
    [secondaryCurrency, getAdaUsdRate, adaPriceSecondary.todayValue],
  );

  useEffect(() => {
    if (!summaryRewards.length) return;

    const monthsData: Record<
      string,
      { ada: number; usd: number; secondary: number; epochs: Set<number> }
    > = {};

    summaryRewards.forEach(reward => {
      if (!reward.spendable_epoch?.end_time) return;

      const rewardDate = new Date(reward.spendable_epoch.end_time);
      const monthKey = `${rewardDate.getFullYear()}-${String(rewardDate.getMonth() + 1).padStart(2, "0")}`;

      if (!monthsData[monthKey]) {
        monthsData[monthKey] = {
          ada: 0,
          usd: 0,
          secondary: 0,
          epochs: new Set(),
        };
      }

      const adaAmount = reward.amount / 1_000_000;
      const usdRate = getAdaUsdRate(reward);
      const secondaryRate = getAdaSecondaryRate(reward);

      monthsData[monthKey].ada += adaAmount;
      monthsData[monthKey].usd += adaAmount * usdRate;
      monthsData[monthKey].secondary += adaAmount * secondaryRate;
      monthsData[monthKey].epochs.add(reward.earned_epoch);
    });

    const summary = Object.entries(monthsData)
      .map(([period, data]) => ({
        period,
        epochs: data.epochs.size,
        ada: data.ada,
        usd: data.usd,
        secondary: data.secondary,
      }))
      .sort((a, b) => b.period.localeCompare(a.period));

    setCachedSummary(summary);
  }, [summaryRewards, getAdaUsdRate, getAdaSecondaryRate, setCachedSummary]);

  useEffect(() => {
    if (lastStakeKey && lastStakeKey !== stakeKey) {
      setPage(1);
      setCachedSummary([]);
    }
    setLastStakeKey(stakeKey);
  }, [stakeKey, lastStakeKey, setCachedSummary, setLastStakeKey]);

  if (!stakeKey || !isValidStakeKey) {
    return null;
  }

  const isLoading =
    summaryQuery.isLoading ||
    epochQuery.isLoading ||
    (summaryQuery.isFetching && !summaryRewards.length);

  return (
    <div className='flex w-full flex-col gap-3 pt-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-text-sm font-medium'>
            {t("taxTool.secondaryCurrency")}
          </span>
          <Select
            value={secondaryCurrency}
            onValueChange={(value: string) =>
              setSecondaryCurrency(value as Currencies)
            }
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currencies).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <span className='uppercase'>{(value as any).value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && !cachedSummary.length ? (
        <>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <LoadingSkeleton height='24px' width='100px' />
              <div className='flex gap-1'>
                <LoadingSkeleton height='36px' width='36px' />
                <LoadingSkeleton height='36px' width='100px' />
              </div>
            </div>
            <LoadingSkeleton height='200px' width='100%' />
          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <LoadingSkeleton height='24px' width='150px' />
              <div className='flex gap-1'>
                <LoadingSkeleton height='36px' width='36px' />
                <LoadingSkeleton height='36px' width='100px' />
              </div>
            </div>
            <LoadingSkeleton height='400px' width='100%' />
          </div>
        </>
      ) : (
        <>
          <SummaryTable
            data={cachedSummary}
            secondaryCurrency={secondaryCurrency}
            query={summaryQuery}
            isOldestMonthIncomplete={isDataTruncated}
          />

          <EpochRewardsTable
            query={epochQuery}
            data={epochRewards}
            secondaryCurrency={secondaryCurrency}
            currentPage={page}
            onPageChange={setPage}
            totalItems={epochQuery.data?.count || 0}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={rows => {
              setStoredRows(rows);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
};
