import type { FC } from "react";
import { useMemo, useCallback, useEffect, useState } from "react";
import { useFetchAccountRewardsPaginated } from "@/services/account";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { isValidAddress } from "@/utils/address/isValidAddress";
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
  const { secondaryCurrency, setSecondaryCurrency } =
    useTaxToolPreferencesStore();
  const {
    rows: storedRows,
    cachedSummary,
    setCachedSummary,
    lastStakeKey,
    setLastStakeKey,
  } = useTaxToolEpochRewardsTableStore();
  const [page, setPage] = useState(1);

  const limit = storedRows;

  const offset = (page - 1) * limit;
  const isValidStakeKey = stakeKey && isValidAddress(stakeKey);

  const adaPriceSecondary = useAdaPriceWithHistory(secondaryCurrency);

  const paginatedQuery = useFetchAccountRewardsPaginated(
    limit,
    offset,
    isValidStakeKey ? stakeKey : "",
  );

  const paginatedRewards = useMemo(() => {
    if (!paginatedQuery.data?.data) return [];
    return paginatedQuery.data.data;
  }, [paginatedQuery.data]);


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

  const getAdaSecondaryRate = useCallback((reward: any): number => {
    if (secondaryCurrency === 'usd') {
      if (
        !reward?.spendable_epoch?.rate ||
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
    }

    if (
      !reward?.spendable_epoch?.rate ||
      !Array.isArray(reward.spendable_epoch.rate)
    ) {
      return adaPriceSecondary.todayValue || 0;
    }

    const rateData = reward.spendable_epoch.rate[0];
    const currencyData = rateData?.[secondaryCurrency];

    if (
      currencyData &&
      Array.isArray(currencyData) &&
      currencyData.length > 0
    ) {
      return currencyData[0]?.close || 0;
    }

    return adaPriceSecondary.todayValue || 0;
  }, [secondaryCurrency, adaPriceSecondary.todayValue]);

  useEffect(() => {
    if (page !== 1 || !paginatedRewards.length) return;

    const now = new Date();
    const monthsData: Record<
      string,
      { ada: number; usd: number; secondary: number; epochs: Set<number> }
    > = {};

    paginatedRewards.forEach(reward => {
      if (!reward.spendable_epoch?.end_time) return;

      const rewardDate = new Date(reward.spendable_epoch.end_time);
      const monthKey = `${rewardDate.getFullYear()}-${String(rewardDate.getMonth() + 1).padStart(2, "0")}`;

      const monthsDiff =
        (now.getFullYear() - rewardDate.getFullYear()) * 12 +
        (now.getMonth() - rewardDate.getMonth());

      if (monthsDiff < 3 && monthsDiff >= 0) {
        if (!monthsData[monthKey]) {
          monthsData[monthKey] = { ada: 0, usd: 0, secondary: 0, epochs: new Set() };
        }

        const adaAmount = reward.amount / 1_000_000;
        const usdRate = getAdaUsdRate(reward);
        const secondaryRate = getAdaSecondaryRate(reward);

        monthsData[monthKey].ada += adaAmount;
        monthsData[monthKey].usd += adaAmount * usdRate;
        monthsData[monthKey].secondary += adaAmount * secondaryRate;
        monthsData[monthKey].epochs.add(reward.earned_epoch);
      }
    });

    const summary = Object.entries(monthsData)
      .map(([period, data]) => ({ period, epochs: data.epochs.size, ada: data.ada, usd: data.usd, secondary: data.secondary }))
      .sort((a, b) => b.period.localeCompare(a.period))
      .slice(0, 3);

    setCachedSummary(summary);
  }, [
    page,
    paginatedRewards,
    getAdaUsdRate,
    getAdaSecondaryRate,
    setCachedSummary,
  ]);

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
    paginatedQuery.isLoading ||
    (paginatedQuery.isFetching && !paginatedRewards.length);

  return (
    <div className='flex w-full flex-col gap-3 pt-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-text-sm font-medium'>Secondary currency:</span>
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
            query={paginatedQuery}
          />

          <EpochRewardsTable
            query={paginatedQuery}
            data={paginatedRewards}
            secondaryCurrency={secondaryCurrency}
            currentPage={page}
            onPageChange={setPage}
            totalItems={paginatedQuery.data?.count || 0}
            itemsPerPage={limit}
          />
        </>
      )}
    </div>
  );
};
