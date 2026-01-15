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
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation("pages");
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const statsRows = [
    {
      key: "pools",
      columns: [
        {
          title: (
            <p className='text-text-sm font-medium text-grayTextPrimary'>
              {t("epochs.stakePoolStats.pools")}
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
              {t("epochs.stakePoolStats.apyLeader")}
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.epoch_no > (miscConst?.epoch.no ?? 0) - 2 ? (
                <Badge color='yellow'>
                  {t("epochs.stakePoolStats.pending")}
                </Badge>
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
              {t("epochs.stakePoolStats.apyMember")}
            </p>
          ),
        },
        {
          title: (
            <p className='text-text-sm'>
              {stats?.epoch_no > (miscConst?.epoch.no ?? 0) - 2 ? (
                <Badge color='yellow'>
                  {t("epochs.stakePoolStats.pending")}
                </Badge>
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
              {t("epochs.stakePoolStats.averageStake")}
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
              {t("epochs.stakePoolStats.delegatorCount")}
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
                {t("epochs.stakePoolStats.delegatorCountWeighted")}
              </span>
              <Tooltip
                content={
                  <p className='w-[200px]'>
                    {t("epochs.stakePoolStats.dcwTooltip")}
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
                {t("epochs.stakePoolStats.delegatorAverage")}
              </span>
              <Tooltip
                content={
                  <p className='w-[200px]'>
                    {t("epochs.stakePoolStats.daTooltip")}
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
                {t("epochs.stakePoolStats.delegatorAverageWeighted")}
              </span>
              <Tooltip
                content={
                  <p className='w-[200px]'>
                    {t("epochs.stakePoolStats.dawTooltip")}
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
      <h3>{t("epochs.stakePoolStats.title")}</h3>

      <div className='flex w-full flex-col overflow-hidden rounded-xl border border-border'>
        {statsRows.map(({ key, columns }, index) => (
          <div
            className={`${index % 2 !== 0 ? "bg-darker" : ""} ${index !== statsRows.length - 1 ? "border-b border-border" : ""} flex h-[55px] flex-grow gap-2`}
            key={key}
          >
            {columns.map(({ title }, columnIndex) => (
              <div
                key={columnIndex}
                className={`flex items-center first:flex-grow first:pl-4 last:pr-4 last:text-right md:flex-1 md:text-left [&>a]:text-primary`}
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
