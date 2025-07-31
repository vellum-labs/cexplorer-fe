import type { useFetchEpochAnalytics } from "@/services/analytics";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { memo } from "react";
import { AnalyticsGraph } from "../../AnalyticsGraph";

import { useTxInEpoch } from "@/hooks/graphs/useTxInEpoch";

interface NetworkTxInEpochGraphProps {
  minHeight?: string;
  epochQuery: ReturnType<typeof useFetchEpochAnalytics>;
  miscConst: MiscConstResponseData | undefined;
}

export const NetworkTxInEpochGraph: FC<NetworkTxInEpochGraphProps> = memo(
  function NetworkTxInEpochGraph({
    minHeight = "400px",
    epochQuery,
    miscConst,
  }) {
    const { json, option, selectedItem, setData, setSelectedItem } =
      useTxInEpoch(miscConst);

    return (
      <AnalyticsGraph
        title='Transactions in epoch'
        description='Visual expression of all transactions on the Cardano network in time.'
        exportButton
        graphSortData={{
          query: epochQuery,
          setData,
          setSelectedItem,
          selectedItem,
        }}
        csvJson={json}
      >
        <div
          className='relative w-full'
          style={{
            maxHeight: minHeight,
          }}
        >
          <GraphWatermark />
          <ReactEcharts
            onEvents={{
              legendselectchanged: params => {
                const { selected } = params;

                localStorage.setItem(
                  "network_tx_in_epoch_graph_store",
                  JSON.stringify(selected),
                );
              },
            }}
            option={option}
            notMerge={false}
            lazyUpdate={false}
            className='h-full w-full'
            style={{
              minHeight,
            }}
          />
        </div>
      </AnalyticsGraph>
    );
  },
);
