import type { BasicRate } from "@/types/miscTypes";
import type { FC } from "react";

import { memo, useMemo } from "react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";
import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import { useAdaPriceWithTVL } from "@/hooks/graphs/useAdaPriceWithTVL";

interface TVLData {
  date: number;
  totalLiquidityUSD: number;
}

interface AdaPriceWithTVLGraphProps {
  graphRates: BasicRate[];
  tvlData: TVLData[];
}

export const AdaPriceWithTVLGraph: FC<AdaPriceWithTVLGraphProps> = memo(
  function AdaPriceWithTVLGraph({ graphRates, tvlData }) {
    const {
      json,
      option,
      selectedItem,
      setData,
      setSelectedItem,
      allMergedData,
    } = useAdaPriceWithTVL(graphRates, tvlData);

    const fakeQuery = useMemo(
      () => ({
        data: { data: allMergedData },
        isLoading: false,
        isFetching: false,
      }),
      [allMergedData],
    );

    return (
      <AnalyticsGraph
        title='ADA/BTC Price vs Total Value Locked (TVL)'
        exportButton
        graphSortData={{
          query: fakeQuery as any,
          setData,
          setSelectedItem,
          selectedItem,
        }}
        sortBy='days'
        csvJson={json}
      >
        <div className='relative w-full'>
          <GraphWatermark />
          <ReactEcharts
            opts={{ height: 350 }}
            option={option}
            notMerge={true}
            lazyUpdate={true}
            className='h-full w-full max-w-full'
          />
        </div>
      </AnalyticsGraph>
    );
  },
);
