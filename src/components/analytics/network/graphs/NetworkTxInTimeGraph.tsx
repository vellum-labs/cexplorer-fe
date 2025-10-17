import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { FC } from "react";

import { memo } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useState, useEffect } from "react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

interface NetworkTxInTimeGraphProps {
  items: {
    timeframe: string;
    transactions: number | undefined;
    tps: string;
    max_tps: string;
  }[];
}

export const NetworkTxInTimeGraph: FC<NetworkTxInTimeGraphProps> = memo(
  function NetworkTxInTimeGraph({ items }) {
    const [graphsVisibility, setGraphsVisibility] = useState(
      items.map(item => item.timeframe),
    );

    const { splitLineColor, textColor } = useGraphColors();
    const { theme } = useThemeStore();

    const option: ReactEChartsProps["option"] = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        confine: true,
      },
      legend: {
        data: ["Transactions", "TPS", "Max TPS"],
        textStyle: {
          color: textColor,
          fontSize: 14,
        },
        left: "center",
        orient: "horizontal",
        type: "scroll",
      },
      grid: {
        top: "20%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: items.map(item => item.timeframe),
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
        axisPointer: {
          label: {
            color: theme === "dark" ? "#000" : undefined,
          },
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Transactions",
          position: "left",
          axisLabel: { color: textColor },
          axisLine: { lineStyle: { color: "#FFB14E" } },
          splitLine: { lineStyle: { color: splitLineColor } },
        },
        {
          type: "value",
          name: "TPS",
          position: "right",
          axisLabel: { color: textColor },
          axisLine: { lineStyle: { color: "#FA8775" } },
        },
      ],
      series: [
        {
          name: "Transactions",
          type: "line",
          smooth: true,
          data: items.map(item => item.transactions),
          yAxisIndex: 0,
          itemStyle: {
            color: "#FFB14E",
          },
          showSymbol: false,
          symbol: "circle",
          symbolSize: 8,
        },
        {
          name: "TPS",
          type: "line",
          smooth: true,
          data: items.map(item => item.tps),
          yAxisIndex: 1,
          itemStyle: {
            color: "#FA8775",
          },
          showSymbol: false,
          symbol: "diamond",
          symbolSize: 8,
        },
        {
          name: "Max TPS",
          type: "line",
          smooth: true,
          data: items.map(item => item.max_tps),
          yAxisIndex: 1,
          itemStyle: {
            color: "#CD34B5",
          },
          showSymbol: false,
          symbol: "triangle",
          symbolSize: 8,
        },
      ],
    };

    useEffect(() => {
      if (window && "localStorage" in window) {
        const graphStore = JSON.parse(
          localStorage.getItem("network_tx_in_time_graph_store") as string,
        );

        if (graphStore) {
          setGraphsVisibility(graphStore);
        } else {
          localStorage.setItem(
            "network_tx_in_time_graph_store",
            JSON.stringify(graphsVisibility),
          );
        }
      }
    }, []);

    return (
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;

              localStorage.setItem(
                "network_tx_in_time_graph_store",
                JSON.stringify(selected),
              );
            },
          }}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    );
  },
);
