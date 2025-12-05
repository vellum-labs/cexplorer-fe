import type { BasicRate } from "@/types/miscTypes";
import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useEffect, useState, useMemo } from "react";
import { useGraphColors } from "../useGraphColors";
import { formatNumber, useThemeStore } from "@vellumlabs/cexplorer-sdk";

interface TVLData {
  date: number;
  totalLiquidityUSD: number;
}

interface MergedDataItem {
  date: string;
  adausd: number | null;
  btcusd: number | null;
  tvl: number;
}

interface UseAdaPriceWithTVL {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setData: Dispatch<SetStateAction<MergedDataItem[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
  allMergedData: MergedDataItem[];
}

export const useAdaPriceWithTVL = (
  graphRates: BasicRate[],
  tvlData: TVLData[],
): UseAdaPriceWithTVL => {
  const [json, setJson] = useState<any>();
  const [data, setData] = useState<MergedDataItem[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const { splitLineColor, textColor, bgColor } = useGraphColors();
  const { theme } = useThemeStore();

  const allMergedData = useMemo(() => {
    const tvlMap = new Map(
      tvlData.map(item => {
        const date = new Date(item.date * 1000).toISOString().split("T")[0];
        return [date, item.totalLiquidityUSD];
      }),
    );

    return graphRates
      .filter(rate => tvlMap.has(rate.date))
      .map(rate => ({
        date: rate.date,
        adausd: rate.adausd,
        btcusd: rate.btcusd,
        tvl: tvlMap.get(rate.date) ?? 0,
      }));
  }, [graphRates, tvlData]);

  const displayData = data ?? allMergedData;

  const dates = displayData.map(d => d.date);
  const adaPrices = displayData.map(d => d.adausd);
  const btcPrices = displayData.map(d => d.btcusd);
  const tvlValues = displayData.map(d => d.tvl);

  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: bgColor,
      confine: true,
      textStyle: { color: textColor },
      formatter: params => {
        return params
          .map(item => {
            const value =
              item.seriesName === "TVL (USD)"
                ? `$${formatNumber(item.value)}`
                : item.value;
            return `${item.marker} ${item.seriesName}: <strong>${value}</strong>`;
          })
          .join("<br/>");
      },
    },
    legend: {
      type: "scroll",
      data: ["ADA/USD", "BTC/USD", "TVL (USD)"],
      textStyle: { color: textColor },
      left: "center",
      orient: "horizontal",
      top: 0,
    },
    grid: {
      left: "1%",
      right: "-3%",
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
        label: { color: theme === "dark" ? "#000" : undefined },
      },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
        axisPointer: {
          label: { color: theme === "dark" ? "#000" : undefined },
        },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: "value",
        position: "right",
        axisLabel: {
          color: textColor,
          formatter: value => `$${(value / 1e6).toFixed(0)}M`,
        },
        axisLine: { lineStyle: { color: textColor } },
        axisPointer: {
          label: { color: theme === "dark" ? "#000" : undefined },
        },
        splitLine: { show: false },
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
        itemStyle: { color: "#008FFB" },
        showSymbol: false,
        smooth: true,
      },
      {
        name: "BTC/USD",
        type: "line",
        data: btcPrices.map(item => item?.toFixed(2)),
        yAxisIndex: 2,
        itemStyle: { color: "#FFA500" },
        showSymbol: false,
        smooth: true,
      },
      {
        name: "TVL (USD)",
        type: "line",
        data: tvlValues.map(item => item?.toFixed(2)),
        yAxisIndex: 1,
        itemStyle: { color: "#e3033a" },
        areaStyle: { color: "rgba(227, 3, 58, 0.2)" },
        showSymbol: false,
        smooth: true,
      },
    ],
  };

  useEffect(() => {
    const tableData = displayData.map(item => ({
      Date: item.date,
      "ADA/USD": item.adausd?.toFixed(2),
      "BTC/USD": item.btcusd?.toFixed(2),
      "TVL (USD)": item.tvl?.toFixed(2),
    }));
    setJson(tableData);
  }, [displayData]);

  return {
    json,
    option,
    selectedItem,
    setData,
    setSelectedItem,
    allMergedData,
  };
};
