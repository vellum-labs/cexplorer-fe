import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import { EpochStakePoolStats } from "./analytics/EpochStakePoolStats";
import { EpochStakedAda } from "./analytics/EpochStakedAda";
import { EpochBars } from "./analytics/EpochBars";
import type { MiscConstResponseData } from "@/types/miscTypes";

interface EpochDetailAnalyticsProps {
  stats: EpochStatsSummary;
  isLoading: boolean;
  isError: boolean;
  constData?: MiscConstResponseData;
}

export const EpochDetailAnalytics: FC<EpochDetailAnalyticsProps> = ({
  stats,
  isError,
  isLoading,
  constData,
}) => {
  return (
    <section className='flex w-full flex-col justify-between gap-1 overflow-x-hidden'>
      <div className='flex w-full flex-wrap gap-1'>
        <EpochStakePoolStats
          isError={isError}
          isLoading={isLoading}
          stats={stats}
        />
        <EpochStakedAda
          stats={stats}
          isLoading={isLoading}
          isError={isError}
          constData={constData}
        />
      </div>
      <EpochBars stats={stats} isError={isError} isLoading={isLoading} />
    </section>
  );
};
