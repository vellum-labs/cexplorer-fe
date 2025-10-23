import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { CircleHelp } from "lucide-react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

interface EpochStakePoolStatsProps {
  isLoading: boolean;
  isError: boolean;
  stats: EpochStatsSummary;
}

export const EpochStakePoolStats: FC<EpochStakePoolStatsProps> = ({
  isError,
  isLoading,
  stats,
}) => {
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const statsRows = [
    {
      key: "pools",
      columns: [
        {
          title: (
            <p className='text-text-sm font-medium text-grayTextPrimary'>
              Pools
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.pool_stat?.pools > 0 &&
                formatNumber(stats?.pool_stat?.pools)}
            </p>
          ),
        },
      ],
    },
    {
      key: "apy_leader",
      columns: [
        {
          title: (
            <p className='text-text-sm font-medium text-grayTextPrimary'>
              APY % Leader
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.epoch_no > (miscConst?.epoch.no ?? 0) - 2 ? (
                <Badge color='yellow'>Pending</Badge>
              ) : (
                <>{((stats?.pool_stat?.pct_leader ?? 0) / 100).toFixed(2)}%</>
              )}
            </p>
          ),
        },
      ],
    },
    {
      key: "apy_member",
      columns: [
        {
          title: (
            <p className='text-text-sm font-medium text-grayTextPrimary'>
              APY % Member
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.epoch_no > (miscConst?.epoch.no ?? 0) - 2 ? (
                <Badge color='yellow'>Pending</Badge>
              ) : (
                <>{((stats?.pool_stat?.pct_member ?? 0) / 100).toFixed(2)}%</>
              )}
            </p>
          ),
        },
      ],
    },
    {
      key: "avg_stake",
      columns: [
        {
          title: (
            <p className='text-text-sm font-medium text-grayTextPrimary'>
              Average Stake
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {(stats?.pool_stat?.epoch_stake ?? 0 > 0) ? (
                <AdaWithTooltip
                  data={stats?.pool_stat?.epoch_stake as number}
                />
              ) : (
                ""
              )}
            </p>
          ),
        },
      ],
    },
    {
      key: "delegator_count",
      columns: [
        {
          title: (
            <p className='text-text-sm font-medium text-grayTextPrimary'>
              Delegator Count
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {(stats?.pool_stat?.delegator_count ?? 0) > 0 &&
                formatNumber(stats?.pool_stat?.delegator_count ?? 0)}
            </p>
          ),
        },
      ],
    },
    {
      key: "delegator_count_w",
      columns: [
        {
          title: (
            <div className='flex items-center gap-1/2'>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                Delegator Count Weighted
              </span>
              <Tooltip
                content={
                  <p className='w-[200px]'>
                    Delegator Count Weighted (DCW) is a metric in staking pool
                    statistics that calculates the weighted average number of
                    delegators contributing to a pool.
                  </p>
                }
              >
                <CircleHelp size={12} className='translate-y-[1px]' />
              </Tooltip>
            </div>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.pool_stat?.delegator_count_sw?.toFixed(2)}
            </p>
          ),
        },
      ],
    },
    {
      key: "delegator_average",
      columns: [
        {
          title: (
            <div className='flex items-center gap-1/2'>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                Delegator Average
              </span>
              <Tooltip
                content={
                  <p className='w-[200px]'>
                    Delegator Average (DA) is a metric in staking pool
                    statistics that represents the simple average amount of
                    stake delegated by each delegator.
                  </p>
                }
              >
                <CircleHelp size={12} className='translate-y-[1px]' />
              </Tooltip>
            </div>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.pool_stat?.delegator_avg?.toFixed(2)}
            </p>
          ),
        },
      ],
    },
    {
      key: "delegator_average_w",
      columns: [
        {
          title: (
            <div className='flex items-center gap-1/2'>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                Delegator Average Weighted
              </span>
              <Tooltip
                content={
                  <p className='w-[200px]'>
                    Delegator Average Weighted (DAW) in Stake Pool Stats
                    measures the average stake amount delegated by all
                    delegators, weighted by the size of each delegation.
                  </p>
                }
              >
                <CircleHelp size={12} className='translate-y-[1px]' />
              </Tooltip>
            </div>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.pool_stat?.delegator_avg_sw?.toFixed(2)}
            </p>
          ),
        },
      ],
    },
  ];

  return (
    <div className='flex h-[520px] w-1/2 flex-grow basis-[600px] flex-col gap-2 rounded-m border border-border p-3 md:flex-shrink-0'>
      <h3>Stake Pool Stats</h3>

      <div className='flex w-full flex-col'>
        {statsRows.map(({ key, columns }, index) => (
          <div
            className={`${index % 2 === 0 ? "rounded-s-m bg-darker" : ""} ${index === 0 ? "rounded-t-m" : ""} flex min-h-[55px] flex-grow`}
            key={key}
          >
            {columns.map(({ title }, index) => (
              <div
                key={index}
                style={{
                  width: 230,
                  maxWidth: 230,
                }}
                className={`flex h-[55px] items-center py-1.5 text-left first:pl-4 last:pr-4 [&>a]:text-primary`}
              >
                {isError || isLoading || !stats ? (
                  <LoadingSkeleton height='20px' />
                ) : (
                  title
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
