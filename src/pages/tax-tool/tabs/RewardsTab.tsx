import type { FC } from "react";
import { useMemo, useCallback, useState } from "react";
import {
  useFetchAccountRewards,
  useFetchAccountRewardsPaginated,
} from "@/services/account";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/constants/currencies";
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
  const { rows: storedRows } = useTaxToolEpochRewardsTableStore();
  const [page, setPage] = useState(1);

  const limit = storedRows;

  const offset = (page - 1) * limit;

  // Get current ADA price in secondary currency for conversions
  const adaPriceSecondary = useAdaPriceWithHistory(secondaryCurrency);

  // Fetch all rewards for summary (first 1000 should be enough for recent months)
  const summaryQuery = useFetchAccountRewards(1000, 0, stakeKey);

  // Fetch paginated rewards for table
  const paginatedQuery = useFetchAccountRewardsPaginated(
    limit,
    offset,
    stakeKey,
  );

  // Get all rewards for summary
  const allRewards = useMemo(() => {
    if (!summaryQuery.data?.pages) return [];
    return summaryQuery.data.pages.flatMap(page => page.data || []);
  }, [summaryQuery.data]);

  // Get paginated rewards for table
  const paginatedRewards = useMemo(() => {
    if (!paginatedQuery.data?.data) return [];
    return paginatedQuery.data.data;
  }, [paginatedQuery.data]);

  // Helper function to extract ADA/USD rate
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

  // Get ADA rate in secondary currency (using current rate as fallback since historical fiat rates may not be available)
  const getAdaSecondaryRate = useCallback((): number => {
    // Use current ADA price in the secondary currency
    // Note: This is not historical, but the /account/reward endpoint doesn't return fiat rates
    return adaPriceSecondary.todayValue || 0;
  }, [adaPriceSecondary.todayValue]);

  // Calculate summary for last 3 months
  const summary = useMemo(() => {
    if (!allRewards.length) return [];

    const now = new Date();
    const monthsData: Record<
      string,
      { ada: number; usd: number; secondary: number }
    > = {};

    allRewards.forEach(reward => {
      if (!reward.spendable_epoch?.end_time) return;

      const rewardDate = new Date(reward.spendable_epoch.end_time);
      const monthKey = `${rewardDate.getFullYear()}-${String(rewardDate.getMonth() + 1).padStart(2, "0")}`;

      // Only include last 3 months
      const monthsDiff =
        (now.getFullYear() - rewardDate.getFullYear()) * 12 +
        (now.getMonth() - rewardDate.getMonth());

      if (monthsDiff < 3 && monthsDiff >= 0) {
        if (!monthsData[monthKey]) {
          monthsData[monthKey] = { ada: 0, usd: 0, secondary: 0 };
        }

        const adaAmount = reward.amount / 1_000_000; // Convert lovelace to ADA
        const usdRate = getAdaUsdRate(reward);
        const secondaryRate = getAdaSecondaryRate();

        monthsData[monthKey].ada += adaAmount;
        monthsData[monthKey].usd += adaAmount * usdRate;
        monthsData[monthKey].secondary += adaAmount * secondaryRate;
      }
    });

    return Object.entries(monthsData)
      .map(([period, data]) => ({ period, ...data }))
      .sort((a, b) => b.period.localeCompare(a.period))
      .slice(0, 3);
  }, [allRewards, getAdaSecondaryRate, getAdaUsdRate]);

  if (!stakeKey) {
    return (
      <div className='flex w-full items-center justify-center py-8 text-grayTextPrimary'>
        Enter a stake key to view rewards
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-3 pt-3'>
      {/* Currency Selector */}
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
                  <span className='uppercase'>{value.value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Table */}
      <SummaryTable
        data={summary}
        secondaryCurrency={secondaryCurrency}
      />

      {/* Epoch by Epoch Table */}
      <EpochRewardsTable
        query={paginatedQuery}
        data={paginatedRewards}
        secondaryCurrency={secondaryCurrency}
        currentPage={page}
        onPageChange={setPage}
        totalItems={paginatedQuery.data?.count || 0}
        itemsPerPage={limit}
      />
    </div>
  );
};
