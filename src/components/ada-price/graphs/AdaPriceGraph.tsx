import type { BasicRate } from "@/types/miscTypes";
import type { FC } from "react";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useEffect, useMemo, useState } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useThemeStore } from "@/stores/themeStore";
import ReactEcharts from "echarts-for-react";

interface AdaPriceGraphProps {
  graphRates: BasicRate[];
}

export const AdaPriceGraph: FC<AdaPriceGraphProps> = ({ graphRates }) => {
  const dates = graphRates.map(d => d.date);
  const adaPrices = graphRates.map(d => d.adausd);
  const btcPrices = graphRates.map(d => d.btcusd);
  const adaBtcPrices = graphRates.map(
    d => (d.adausd as number) / (d.btcusd as number),
  );

  const [graphsVisibility, setGraphsVisibility] = useState({
    "ADA/USD": true,
    "BTC/USD": true,
    "ADA/BTC": true,
  });

  const { splitLineColor, textColor, bgColor } = useGraphColors();

  const { theme } = useThemeStore();

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("ada_price_graph_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "ada_price_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: bgColor,
      confine: true,
      textStyle: {
        color: textColor,
      },
      formatter: params => {
        return params
          .map(
            item =>
              `${item.marker} ${item.seriesName}: <strong>${item.value}</strong>`,
          )
          .join("<br/>");
      },
    },
    legend: {
      type: "scroll",
      data: ["ADA/USD", "BTC/USD", "ADA/BTC"],
      textStyle: {
        color: textColor,
      },
      left: "center",
      orient: "horizontal",
      selected: Object.keys(graphsVisibility).reduce((acc, key) => {
        acc[key] = graphsVisibility[key];
        return acc;
      }, {}),
    },
    grid: {
      left: "4%",
      right: "7%",
      bottom: "11%",
      top: "10%",
    },
    xAxis: {
      type: "category",
      data: dates,
      inverse: true,
      name: "Dates",
      nameLocation: "middle",
      nameGap: 28,
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
        position: "left",
        name: "ADA/USD",
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
        axisPointer: {
          label: {
            color: theme === "dark" ? "#000" : undefined,
          },
        },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: "value",
        position: "right",
        name: "BTC/USD",
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
        axisPointer: {
          label: {
            color: theme === "dark" ? "#000" : undefined,
          },
        },
        splitLine: {
          show: false,
        },
      },
      {
        type: "value",
        show: false,
      },
    ],
    series: [
      {
        name: "ADA/USD",
        type: "line",
        data: adaPrices.map(item => item?.toFixed(2)),
        yAxisIndex: 0,
        itemStyle: {
          color: "#008FFB",
        },
        showSymbol: false,
        smooth: true,
      },
      {
        name: "BTC/USD",
        type: "line",
        data: btcPrices.map(item => item?.toFixed(2)),
        yAxisIndex: 1,
        itemStyle: {
          color: "#FFA500",
        },
        showSymbol: false,
        smooth: true,
      },
      {
        name: "ADA/BTC",
        type: "line",
        data: adaBtcPrices.map(item => item?.toFixed(9)),
        yAxisIndex: 2,
        itemStyle: {
          color: "#00FF00",
        },
        showSymbol: false,
        smooth: true,
      },
    ],
  };

  return (
    <div className='relative w-full max-w-[900px] rounded-m border border-border bg-cardBg lg:py-3'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 350 }}
        onEvents={{
          legendselectchanged: useMemo(
            () => params => {
              const { selected } = params;

              localStorage.setItem(
                "ada_price_graph_store",
                JSON.stringify(selected),
              );
            },
            [],
          ),
        }}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='h-full w-full max-w-full'
      />
    </div>
  );
};
