import type { BasicRate } from "@/types/miscTypes";
import type { AnalyticsRateResponseData } from "@/types/analyticsTypes";
import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useEffect, useState, useMemo } from "react";
import { useGraphColors } from "../useGraphColors";
import { formatNumber, useThemeStore } from "@vellumlabs/cexplorer-sdk";

interface MergedDataItem {
  date: string;
  adausd: number | null;
  btcusd: number | null;
  activeAddresses: number;
}

interface UseAdaPriceWithActiveAddresses {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setData: Dispatch<SetStateAction<MergedDataItem[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
  allMergedData: MergedDataItem[];
}

export const useAdaPriceWithActiveAddresses = (
  graphRates: BasicRate[],
  analyticsData: AnalyticsRateResponseData[],
): UseAdaPriceWithActiveAddresses => {
  const [json, setJson] = useState<any>();
  const [data, setData] = useState<MergedDataItem[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const { splitLineColor, textColor, bgColor } = useGraphColors();
  const { theme } = useThemeStore();

  const allMergedData = useMemo(() => {
    const analyticsMap = new Map(
      analyticsData.map(item => [
        item.date,
        item.stat?.count_tx_out_address ?? 0,
      ]),
    );

    return graphRates
      .filter(rate => analyticsMap.has(rate.date))
      .map(rate => ({
        date: rate.date,
        adausd: rate.adausd,
        btcusd: rate.btcusd,
        activeAddresses: analyticsMap.get(rate.date) ?? 0,
      }));
  }, [graphRates, analyticsData]);

  const displayData = data ?? allMergedData;

  const dates = displayData.map(d => d.date);
  const adaPrices = displayData.map(d => d.adausd);
  const btcPrices = displayData.map(d => d.btcusd);
  const activeAddresses = displayData.map(d => d.activeAddresses);

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
              item.seriesName === "Active Addresses"
                ? formatNumber(item.value)
                : item.value;
            return `${item.marker} ${item.seriesName}: <strong>${value}</strong>`;
          })
          .join("<br/>");
      },
    },
    legend: {
      type: "scroll",
      data: ["ADA/USD", "BTC/USD", "Active Addresses"],
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
        axisLabel: { color: textColor },
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
        name: "Active Addresses",
        type: "bar",
        data: activeAddresses,
        yAxisIndex: 1,
        itemStyle: { color: "#FF4560" },
      },
    ],
  };

  useEffect(() => {
    const tableData = displayData.map(item => ({
      Date: item.date,
      "ADA/USD": item.adausd?.toFixed(2),
      "BTC/USD": item.btcusd?.toFixed(2),
      "Active Addresses": item.activeAddresses,
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
