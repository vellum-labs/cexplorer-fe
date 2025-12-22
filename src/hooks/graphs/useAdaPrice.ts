import type { BasicRate } from "@/types/miscTypes";
import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useEffect, useState, useMemo } from "react";
import { useGraphColors } from "../useGraphColors";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { EPOCH_LENGTH_DAYS } from "@/constants/confVariables";

interface UseAdaPrice {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setData: Dispatch<SetStateAction<BasicRate[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
  graphsVisibility: Record<string, boolean>;
  onLegendSelectChanged: (params: {
    selected: Record<string, boolean>;
  }) => void;
  allData: BasicRate[];
}

const thirtyDaysCount = Math.ceil(6 * EPOCH_LENGTH_DAYS);

export const useAdaPrice = (graphRates: BasicRate[]): UseAdaPrice => {
  const [json, setJson] = useState<any>();

  const [data, setData] = useState<BasicRate[] | undefined>(() => {
    if (graphRates.length > 0) {
      return graphRates.slice(0, thirtyDaysCount);
    }
    return undefined;
  });
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const [graphsVisibility] = useState<Record<string, boolean>>(() => {
    const defaultVisibility = {
      "ADA/USD": true,
      "BTC/USD": true,
      "ADA/BTC": true,
    };

    if (typeof window !== "undefined" && "localStorage" in window) {
      const graphStore = localStorage.getItem("ada_price_graph_store");
      if (graphStore) {
        try {
          return JSON.parse(graphStore);
        } catch {
          return defaultVisibility;
        }
      }
      localStorage.setItem(
        "ada_price_graph_store",
        JSON.stringify(defaultVisibility),
      );
    }
    return defaultVisibility;
  });

  const { splitLineColor, textColor, bgColor } = useGraphColors();
  const { theme } = useThemeStore();

  const displayData = data ?? graphRates;

  const dates = displayData.map(d => d.date);
  const adaPrices = displayData.map(d => d.adausd);
  const btcPrices = displayData.map(d => d.btcusd);
  const adaBtcPrices = displayData.map(
    d => (d.adausd as number) / (d.btcusd as number),
  );

  const onLegendSelectChanged = useMemo(
    () => (params: { selected: Record<string, boolean> }) => {
      localStorage.setItem(
        "ada_price_graph_store",
        JSON.stringify(params.selected),
      );
    },
    [],
  );

  const option: ReactEChartsProps["option"] = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: bgColor,
        confine: true,
        textStyle: {
          color: textColor,
        },
        formatter: params => {
          const date = params[0]?.name ?? "";
          const items = params
            .map(
              item =>
                `${item.marker} ${item.seriesName}: <strong>${item.value}</strong>`,
            )
            .join("<br/>");
          return `${date}<hr style="margin: 4px 0"/>${items}`;
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
        top: 0,
        selected: Object.keys(graphsVisibility).reduce((acc, key) => {
          acc[key] = graphsVisibility[key];
          return acc;
        }, {}),
      },
      grid: {
        left: "1%",
        right: "-6%",
        bottom: "14%",
        top: 30,
        containLabel: true,
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
          axisPointer: { show: false },
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
    }),
    [
      dates,
      adaPrices,
      btcPrices,
      adaBtcPrices,
      graphsVisibility,
      splitLineColor,
      textColor,
      bgColor,
      theme,
    ],
  );

  useEffect(() => {
    const tableData = displayData.map(item => ({
      Date: item.date,
      "ADA/USD": item.adausd?.toFixed(2),
      "BTC/USD": item.btcusd?.toFixed(2),
      "ADA/BTC": ((item.adausd as number) / (item.btcusd as number))?.toFixed(
        9,
      ),
    }));
    setJson(tableData);
  }, [displayData]);

  return {
    json,
    option,
    selectedItem,
    setData,
    setSelectedItem,
    graphsVisibility,
    onLegendSelectChanged,
    allData: graphRates,
  };
};
