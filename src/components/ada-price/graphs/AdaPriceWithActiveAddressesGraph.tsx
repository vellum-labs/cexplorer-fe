import type { BasicRate } from "@/types/miscTypes";
import type { AnalyticsRateResponseData } from "@/types/analyticsTypes";
import type { FC } from "react";

import { memo, useMemo } from "react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";
import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import { useAdaPriceWithActiveAddresses } from "@/hooks/graphs/useAdaPriceWithActiveAddresses";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AdaPriceWithActiveAddressesGraphProps {
  graphRates: BasicRate[];
  analyticsData: AnalyticsRateResponseData[];
}

export const AdaPriceWithActiveAddressesGraph: FC<AdaPriceWithActiveAddressesGraphProps> =
  memo(function AdaPriceWithActiveAddressesGraph({
    graphRates,
    analyticsData,
  }) {
    const { t } = useAppTranslation("common");
    const {
      json,
      option,
      selectedItem,
      setSelectedItem,
      allMergedData,
    } = useAdaPriceWithActiveAddresses(graphRates, analyticsData);

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
        title={t("adaPrice.adaBtcPriceVsActiveAddresses")}
        exportButton
        graphSortData={{
          query: fakeQuery as any,
          setData: () => {},
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
  });
