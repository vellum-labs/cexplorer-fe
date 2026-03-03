import type { BasicRate } from "@/types/miscTypes";
import type { AnalyticsRateResponseData } from "@/types/analyticsTypes";
import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useState, useMemo } from "react";
import { useGraphColors } from "../useGraphColors";
import { formatNumber, useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { EPOCH_LENGTH_DAYS } from "@/constants/confVariables";

interface MergedDataItem {
  date: string;
  adausd: number | null;
  btcusd: number | null;
  txVolume: number;
}

interface UseAdaPriceWithTxVolume {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
  allMergedData: MergedDataItem[];
}

export const useAdaPriceWithTxVolume = (
  graphRates: BasicRate[],
  analyticsData: AnalyticsRateResponseData[],
): UseAdaPriceWithTxVolume => {
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const { splitLineColor, textColor, bgColor } = useGraphColors();
  const { theme } = useThemeStore();

  const allMergedData = useMemo(() => {
    const analyticsMap = new Map(
      analyticsData.map(item => [item.date, item.stat?.count_tx_out ?? 0]),
    );

    return graphRates
      .filter(rate => analyticsMap.has(rate.date))
      .map(rate => ({
        date: rate.date,
        adausd: rate.adausd,
        btcusd: rate.btcusd,
        txVolume: analyticsMap.get(rate.date) ?? 0,
      }));
  }, [graphRates, analyticsData]);

  const displayData = useMemo(() => {
    switch (selectedItem) {
      case GraphTimePeriod.AllTime:
        return allMergedData;
      case GraphTimePeriod.FiveDays:
        return allMergedData.slice(0, Math.ceil(EPOCH_LENGTH_DAYS));
      case GraphTimePeriod.TenDays:
        return allMergedData.slice(0, Math.ceil(2 * EPOCH_LENGTH_DAYS));
      case GraphTimePeriod.HundredDays:
        return allMergedData.slice(0, Math.ceil(20 * EPOCH_LENGTH_DAYS));
      case GraphTimePeriod.FiveHundredDays:
        return allMergedData.slice(0, Math.ceil(100 * EPOCH_LENGTH_DAYS));
      case GraphTimePeriod.ThirtyDays:
      default:
        return allMergedData.slice(0, Math.ceil(6 * EPOCH_LENGTH_DAYS));
    }
  }, [allMergedData, selectedItem]);

  const dates = displayData.map(d => d.date);
  const adaPrices = displayData.map(d => d.adausd);
  const btcPrices = displayData.map(d => d.btcusd);
  const txVolumes = displayData.map(d => d.txVolume);

  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: bgColor,
      confine: true,
      textStyle: { color: textColor },
      formatter: params => {
        const date = params[0]?.name ?? "";
        const items = params
          .map(item => {
            const value =
              item.seriesName === "TX Output Volume"
                ? formatNumber(item.value)
                : item.value;
            return `${item.marker} ${item.seriesName}: <strong>${value}</strong>`;
          })
          .join("<br/>");
        return `${date}<hr style="margin: 4px 0"/>${items}`;
      },
    },
    legend: {
      type: "scroll",
      data: ["ADA/USD", "BTC/USD", "TX Output Volume"],
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
        name: "TX Output Volume",
        type: "bar",
        data: txVolumes,
        yAxisIndex: 1,
        itemStyle: { color: "#775DD0" },
      },
    ],
  };

  const json = useMemo(
    () =>
      displayData.map(item => ({
        Date: item.date,
        "ADA/USD": item.adausd?.toFixed(2),
        "BTC/USD": item.btcusd?.toFixed(2),
        "TX Output Volume": item.txVolume,
      })),
    [displayData],
  );

  return {
    json,
    option,
    selectedItem,
    setSelectedItem,
    allMergedData,
  };
};
