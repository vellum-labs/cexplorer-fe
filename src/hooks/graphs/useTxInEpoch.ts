import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useEffect, useState, useMemo } from "react";
import { useGraphColors } from "../useGraphColors";
import { formatNumber } from "@/utils/format/format";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";

interface UseTxInEpoch {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setData: Dispatch<SetStateAction<EpochAnalyticsResponseData[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
}

export const useTxInEpoch = (
  miscConst: MiscConstResponseData | undefined,
): UseTxInEpoch => {
  const [json, setJson] = useState<any>();
  const [data, setData] = useState<EpochAnalyticsResponseData[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const [graphsVisibility] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("network_tx_in_epoch_graph_store");
    return stored ? JSON.parse(stored) : {};
  });

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const { xAxisData, stackedSeries, lineSeries, sortedLegend, tableData } =
    useMemo(() => {
      const allEpochs = data?.map(item => item.no) ?? [];

      const stackedTotals: Record<string, number[]> = {};
      const lineTotals: number[] = [];

      (data ?? []).forEach((epochData, i) => {
        const epochComposition = epochData?.stat?.tx_composition ?? {};
        const epochTotal = (Object.values(epochComposition) as number[]).reduce(
          (acc: number, cur: number) => acc + cur,
          0,
        );

        const get = (key: string) => epochComposition[key] || 0;
        const total = epochTotal > 0 ? epochTotal : 1;

        const knownKeys = [
          "script",
          "datum",
          "delegation",
          "delegation_vote",
          "drep_registration",
          "gov_action_proposal",
          "ma_tx_mint",
          "ma_tx_out",
          "pool_update",
          "redeemer_data",
          "stake_registration",
          "stake_deregistration",
          "tx_metadata",
          "withdrawal",
        ];

        knownKeys.forEach(key => {
          if (!stackedTotals[key]) stackedTotals[key] = [];
          stackedTotals[key][i] = (get(key) / total) * 100;
        });

        const knownSum = knownKeys.reduce(
          (sum, key) => sum + (get(key) / total) * 100,
          0,
        );
        stackedTotals.Other = stackedTotals.Other || [];
        stackedTotals.Other[i] = Math.max(0, 100 - knownSum);

        lineTotals[i] = epochData?.stat?.count_tx ?? 0;
      });

      const keyLabelMap: Record<string, string> = {
        script: "Smart contract transactions",
        datum: "Datum",
        delegation: "Delegation",
        delegation_vote: "Delegation vote",
        drep_registration: "DRep registration",
        gov_action_proposal: "Government action proposal",
        ma_tx_mint: "Multi-Asset minting",
        ma_tx_out: "Multi-Asset transfers",
        pool_update: "Pool update",
        redeemer_data: "Redeemer data",
        stake_registration: "Stake registration",
        stake_deregistration: "Stake deregistration",
        tx_metadata: "Transaction metadata",
        withdrawal: "Withdrawal",
        Other: "Other",
      };

      const totalPerKey = Object.entries(stackedTotals).reduce(
        (acc, [key, values]) => {
          acc[key] = values.reduce((sum, v) => sum + v, 0);
          return acc;
        },
        {} as Record<string, number>,
      );

      const sortedStackKeys = Object.keys(stackedTotals).sort(
        (a, b) => totalPerKey[b] - totalPerKey[a],
      );

      const stackedSeries = sortedStackKeys.map(key => ({
        name: keyLabelMap[key] ?? key,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: stackedTotals[key],
      }));

      const lineSeries = {
        name: "Transactions",
        type: "line",
        data: lineTotals,
        yAxisIndex: 1,
        showSymbol: false,
        itemStyle: { color: "#0094D4" },
        lineStyle: { width: 3 },
        z: 3,
      };

      const tableData = allEpochs.map((epoch, index) => {
        const row: Record<string, any> = {
          Epoch: epoch,
          Transactions: lineTotals[index],
        };
        sortedStackKeys.forEach(key => {
          row[keyLabelMap[key] ?? key] = stackedTotals[key][index];
        });
        return row;
      });

      return {
        xAxisData: allEpochs,
        stackedSeries,
        lineSeries,
        sortedLegend: [
          "Transactions",
          ...sortedStackKeys.map(key => keyLabelMap[key] ?? key),
        ],
        tableData,
      };
    }, [data]);

  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      confine: true,
      formatter: function (params) {
        const epoch = params[0]?.axisValue;
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${epoch})<hr>` +
          `<div>${params
            .map(item => {
              const value =
                item.seriesName === "Transactions"
                  ? formatNumber(item.value)
                  : `${Number(item.value).toFixed(2)}%`;
              return `<p>${item.marker} ${item.seriesName}: ${value}</p>`;
            })
            .join("")}</div>`
        );
      },
    },
    legend: {
      type: "scroll",
      data: sortedLegend,
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      selected: Object.fromEntries(
        sortedLegend.map(name => [name, graphsVisibility[name] ?? true]),
      ),
      selectedMode: "multiple",
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      inverse: true,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        max: 100,
        axisLabel: { color: textColor, formatter: "{value}%" },
        axisLine: { lineStyle: { color: textColor } },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: "value",
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
      },
    ],
    series: [lineSeries, ...stackedSeries] as echarts.EChartsOption["series"],
  };

  useEffect(() => {
    setJson(tableData);
  }, [tableData]);

  return {
    json,
    option,
    selectedItem,
    setData,
    setSelectedItem,
  };
};
