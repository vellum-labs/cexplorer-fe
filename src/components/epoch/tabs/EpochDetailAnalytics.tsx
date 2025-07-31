import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import { EpochStakePoolStats } from "./analytics/EpochStakePoolStats";
import { EpochStakedAda } from "./analytics/EpochStakedAda";
import { EpochBars } from "./analytics/EpochBars";

interface EpochDetailAnalyticsProps {
  stats: EpochStatsSummary;
  isLoading: boolean;
  isError: boolean;
}

export const EpochDetailAnalytics: FC<EpochDetailAnalyticsProps> = ({
  stats,
  isError,
  isLoading,
}) => {
  return (
    <section className='flex w-full flex-col justify-between gap-2 overflow-x-hidden'>
      <div className='flex w-full flex-wrap gap-2'>
        <EpochStakePoolStats
          isError={isError}
          isLoading={isLoading}
          stats={stats}
        />
        <EpochStakedAda stats={stats} isLoading={isLoading} isError={isError} />
      </div>
      <EpochBars stats={stats} isError={isError} isLoading={isLoading} />
    </section>
  );
};
