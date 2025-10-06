import type { DeFiTokenStatData } from "@/types/tokenTypes";
import type { FC } from "react";

import { GraphTimePeriod } from "@/types/graphTypes";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import { TokenDashboardDexTradesGraph } from "../graphs/TokenDashboardDexTradesGraph";
import { TokenDashboardRevenueGraph } from "../graphs/TokenDashboardRevenueGraph";

import { useFetchDeFiTokenStat } from "@/services/token";
import { useState } from "react";

export const TokenDashboardExchangeTab: FC = () => {
  const [data, setData] = useState<DeFiTokenStatData[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const query = useFetchDeFiTokenStat();

  return (
    <AnalyticsGraph
      graphSortData={{
        query,
        setData,
        selectedItem,
        setSelectedItem,
      }}
      sortBy='days'
    >
      <div className='flex w-full flex-col pt-1 xl:flex-row'>
        <TokenDashboardDexTradesGraph data={data} />
        <TokenDashboardRevenueGraph data={data} />
      </div>
    </AnalyticsGraph>
  );
};
