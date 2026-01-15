import type { BasicRate } from "@/types/miscTypes";
import type { FC } from "react";

import { memo, useMemo } from "react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";
import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import { useAdaPrice } from "@/hooks/graphs/useAdaPrice";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AdaPriceGraphProps {
  graphRates: BasicRate[];
}

export const AdaPriceGraph: FC<AdaPriceGraphProps> = memo(
  function AdaPriceGraph({ graphRates }) {
    const { t } = useAppTranslation("common");
    const {
      json,
      option,
      selectedItem,
      setData,
      setSelectedItem,
      onLegendSelectChanged,
      allData,
    } = useAdaPrice(graphRates);

    const fakeQuery = useMemo(
      () => ({
        data: { data: allData },
        isLoading: false,
        isFetching: false,
      }),
      [allData],
    );

    return (
      <AnalyticsGraph
        title={t("adaPrice.adaBtcPrice")}
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
            onEvents={{
              legendselectchanged: onLegendSelectChanged,
            }}
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
