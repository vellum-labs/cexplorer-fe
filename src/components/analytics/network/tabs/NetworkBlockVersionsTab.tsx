import type { FC } from "react";

import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { Router } from "lucide-react";
import { AnalyticsGraph } from "../../AnalyticsGraph";
import { NetworkBlockVersionsByDatePieGraph } from "../graphs/NetworkBlockVersionsByDatePieGraph";
import { NetworkBlockVersionsLatestBlocksGraph } from "../graphs/NetworkBlockVersionsLatestBlocksGraph";
import { NetworkBlockVersionsPieGraph } from "../graphs/NetworkBlockVersionsPieGraph";
import { NetworkBlockVersionsPoolGraph } from "../graphs/NetworkBlockVersionsPoolGraph";
import { NetworkBlockVersionsTable } from "../tables/NetworkBlockVersionsTable";

import { Button } from "@vellumlabs/cexplorer-sdk";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchBlocksList } from "@/services/blocks";
import {
  useFetchAnalyticsRate,
  useFetchEpochAnalytics,
} from "@/services/analytics";

export const NetworkBlockVersionsTab: FC = () => {
  const { t } = useAppTranslation("common");
  const epochQuery = useFetchEpochAnalytics();
  const rateQuery = useFetchAnalyticsRate();

  const latestBlockVersion = Math.max(
    ...(epochQuery.data?.data[0].stat?.block_version.map(
      item => item.version,
    ) ?? []),
  );

  const versions = epochQuery.data?.data.reduce((acc, prev) => {
    const blockVersions = prev.stat?.block_version ?? [];

    for (let i = 0; i < blockVersions.length; i++) {
      acc[blockVersions[i].version] =
        acc[blockVersions[i].version] + blockVersions[i].count ||
        blockVersions[i].count;
    }

    return acc;
  }, {});

  const sortedVersions = Object.entries((versions ?? []) as any).sort(
    (a, b) => +b[0] - +a[0],
  );

  const blocksQuery = useFetchBlocksList(100, 0, true);
  return (
    <section className='flex w-full max-w-desktop flex-col gap-1.5'>
      <div className='flex w-full flex-col items-start gap-2 lg:flex-row lg:items-stretch'>
        <OverviewStatCard
          icon={<Router className='text-primary' />}
          title={t("analytics.latestNodeVersion")}
          value={
            <div className='flex flex-col gap-1'>
              <p className='text-display-xs font-semibold'>
                {latestBlockVersion.toFixed(1)}
              </p>
              <p className='text-text-xs font-regular leading-4 text-grayTextPrimary'>
                {t("analytics.latestNodeVersionDescription")}
              </p>
            </div>
          }
          description={
            <div className='flex gap-1'>
              <div className='flex h-[40px] w-fit flex-grow cursor-pointer items-center justify-center gap-1/2 rounded-s border border-border px-1.5'>
                <span className='sm:text-sm text-text-xs font-medium text-text'>
                  {t("analytics.hardforkStatus")}
                </span>
              </div>
              <Button
                label={t("analytics.readMore", {
                  version: latestBlockVersion.toFixed(1),
                })}
                variant='primary'
                size='sm'
              />
            </div>
          }
          className='w-fit basis-auto justify-between self-start md:min-w-[400px] md:basis-[215px]'
        />
        <NetworkBlockVersionsTable
          epochQuery={epochQuery}
          sortedVersions={sortedVersions}
        />
      </div>
      <div className='flex flex-wrap items-stretch gap-1.5 lg:flex-nowrap'>
        <AnalyticsGraph
          className='flex-grow'
          description={t("analytics.blockVersions100Blocks")}
        >
          <NetworkBlockVersionsPieGraph query={blocksQuery} />
        </AnalyticsGraph>
        <AnalyticsGraph
          className='flex-grow'
          description={t("analytics.blockVersionsOneDay")}
        >
          <NetworkBlockVersionsByDatePieGraph query={rateQuery} day={1} />
        </AnalyticsGraph>
        <AnalyticsGraph
          className='flex-grow'
          description={t("analytics.blockVersions7Days")}
        >
          <NetworkBlockVersionsByDatePieGraph query={rateQuery} day={7} />
        </AnalyticsGraph>
        <AnalyticsGraph
          className='flex-grow'
          description={t("analytics.blockVersions30Days")}
        >
          <NetworkBlockVersionsByDatePieGraph query={rateQuery} day={30} />
        </AnalyticsGraph>
      </div>
      <AnalyticsGraph
        title={t("analytics.poolSupportingSignal")}
        description={t("analytics.poolSupportingSignalDescription")}
      >
        <NetworkBlockVersionsPoolGraph sortedVersions={sortedVersions} />
      </AnalyticsGraph>
      <AnalyticsGraph
        title={t("analytics.latestBlocksVersions")}
        description={t("analytics.latestBlocksVersionsDescription")}
      >
        <NetworkBlockVersionsLatestBlocksGraph
          query={blocksQuery}
          sortedVersions={sortedVersions}
        />
      </AnalyticsGraph>
    </section>
  );
};
