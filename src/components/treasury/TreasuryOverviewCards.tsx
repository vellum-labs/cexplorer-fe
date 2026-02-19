import type { FC } from "react";
import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import {
  formatNumber,
  formatNumberWithSuffix,
  LoadingSkeleton,
  Tooltip,
} from "@vellumlabs/cexplorer-sdk";
import {
  useFetchTreasury,
  useFetchStatistics,
} from "@/services/vendorContracts";
import { formatDistanceToNow } from "date-fns";

interface TreasuryOverviewCardsProps {
  labels: {
    budget: {
      title: string;
      description: string;
      currency: string;
      budgetLabel: string;
      totalSpent: string;
      remainingBudget: string;
    };
    statistics: {
      title: string;
      totalDistributed: string;
      completedProjects: string;
      completedMilestones: string;
      lastUpdate: string;
    };
  };
}

export const TreasuryOverviewCards: FC<TreasuryOverviewCardsProps> = ({
  labels,
}) => {
  const treasuryQuery = useFetchTreasury();
  const statisticsQuery = useFetchStatistics();

  const statistics = statisticsQuery.data?.data;
  const financials = statistics?.financials;
  const projects = statistics?.projects;
  const milestones = statistics?.milestones;
  const sync = statistics?.sync;

  const totalAllocated = financials?.total_allocated_ada || 0;
  const totalDisbursed = financials?.total_disbursed_ada || 0;
  const currentBalance = financials?.current_balance_ada || 0;
  const spentPercentage =
    totalAllocated > 0
      ? Math.round((totalDisbursed / totalAllocated) * 100)
      : 0;

  const lastUpdated = sync?.last_updated
    ? formatDistanceToNow(new Date(sync.last_updated), { addSuffix: true })
    : "-";
  const lastUpdatedDate = sync?.last_updated
    ? new Date(sync.last_updated).toLocaleString()
    : "";

  const isLoading = treasuryQuery.isLoading || statisticsQuery.isLoading;

  if (isLoading) {
    return (
      <div className='mb-2 flex w-full flex-wrap gap-2'>
        <div className='min-h-[180px] flex-1 basis-[400px] rounded-l border border-border bg-cardBg p-2'>
          <LoadingSkeleton height='24px' width='80px' />
          <div className='mt-1'>
            <LoadingSkeleton height='16px' width='100%' />
          </div>
          <div className='mt-2'>
            <LoadingSkeleton height='60px' width='100%' />
          </div>
        </div>
        <div className='min-h-[180px] flex-1 basis-[400px] rounded-l border border-border bg-cardBg p-2'>
          <LoadingSkeleton height='24px' width='80px' />
          <div className='mt-2 space-y-1'>
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mb-2 flex w-full flex-wrap gap-2'>
      <div className='min-h-[180px] flex-1 basis-[400px] rounded-l border border-border bg-cardBg p-2'>
        <h2 className='text-text-md font-medium'>{labels.budget.title}</h2>
        <p className='mt-1/2 text-text-sm text-grayTextSecondary'>
          {labels.budget.description}
        </p>

        <div className='mt-2 flex flex-wrap items-end gap-3'>
          <div className='flex flex-col'>
            <span className='text-text-xs text-grayTextSecondary'>
              {labels.budget.currency}
            </span>
            <span className='text-text-sm font-medium'>ADA</span>
          </div>

          <div className='flex flex-col'>
            <span className='text-text-xs text-grayTextSecondary'>
              {labels.budget.budgetLabel}
            </span>
            <Tooltip content={`₳${formatNumber(Math.round(currentBalance))}`}>
              <span className='text-text-sm font-medium'>
                ₳{formatNumberWithSuffix(Math.round(currentBalance))}
              </span>
            </Tooltip>
          </div>

          <div className='flex flex-col'>
            <span className='text-text-xs text-grayTextSecondary'>
              {labels.budget.totalSpent}
            </span>
            <div className='flex items-center gap-1'>
              <Tooltip content={`₳${formatNumber(Math.round(totalDisbursed))}`}>
                <span className='text-text-sm font-medium'>
                  ₳{formatNumberWithSuffix(Math.round(totalDisbursed))}
                </span>
              </Tooltip>
              <span className='text-text-xs text-grayTextSecondary'>
                {spentPercentage}%
              </span>
            </div>
            <div className='mt-1/2 h-1 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className='h-full rounded-full bg-primary'
                style={{ width: `${spentPercentage}%` }}
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <span className='text-text-xs text-grayTextSecondary'>
              {labels.budget.remainingBudget}
            </span>
            <Tooltip content={`₳${formatNumber(Math.round(totalAllocated - totalDisbursed))}`}>
              <span className='text-text-sm font-medium'>
                ₳{formatNumberWithSuffix(Math.round(totalAllocated - totalDisbursed))}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>

      <OverviewCard
        title={labels.statistics.title}
        className='min-h-[180px]'
        hFit
        columnGap='24px'
        overviewList={[
          {
            label: labels.statistics.totalDistributed,
            value: (
              <Tooltip content={`₳${formatNumber(Math.round(totalDisbursed))}/${formatNumber(Math.round(totalAllocated))} ADA`}>
                <span className='font-medium'>
                  ₳{formatNumberWithSuffix(Math.round(totalDisbursed))}/
                  {formatNumberWithSuffix(Math.round(totalAllocated))} ADA
                </span>
              </Tooltip>
            ),
          },
          {
            label: labels.statistics.completedProjects,
            value: (
              <span className='font-medium'>
                {projects?.completed_count || 0}/{projects?.total_count || 0}
              </span>
            ),
          },
          {
            label: labels.statistics.completedMilestones,
            value: (
              <span className='font-medium'>
                {milestones?.completed_count || 0}/
                {milestones?.total_count || 0}
              </span>
            ),
          },
          {
            label: labels.statistics.lastUpdate,
            value: (
              <span className='font-medium'>
                {lastUpdated}
                {lastUpdatedDate && (
                  <span className='ml-1 text-grayTextSecondary'>
                    ({lastUpdatedDate})
                  </span>
                )}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};
