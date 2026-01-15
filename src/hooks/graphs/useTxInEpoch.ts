import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { Dispatch, SetStateAction } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useEffect, useState, useMemo } from "react";
import { useGraphColors } from "../useGraphColors";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation("pages");
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
        script: t("analytics.graph.smartContractTransactions"),
        datum: t("analytics.graph.datum"),
        delegation: t("analytics.graph.delegation"),
        delegation_vote: t("analytics.graph.delegationVote"),
        drep_registration: t("analytics.graph.drepRegistration"),
        gov_action_proposal: t("analytics.graph.govActionProposal"),
        ma_tx_mint: t("analytics.graph.maTokenMinting"),
        ma_tx_out: t("analytics.graph.maTokenTransfers"),
        pool_update: t("analytics.graph.poolUpdate"),
        redeemer_data: t("analytics.graph.redeemerData"),
        stake_registration: t("analytics.graph.stakeRegistration"),
        stake_deregistration: t("analytics.graph.stakeDeregistration"),
        tx_metadata: t("analytics.graph.txMetadata"),
        withdrawal: t("analytics.graph.withdrawal"),
        Other: t("analytics.graph.other"),
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

      const transactionsLabel = t("analytics.graph.transactions");

      const lineSeries = {
        name: transactionsLabel,
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
          [t("epochs.graph.epoch")]: epoch,
          [transactionsLabel]: lineTotals[index],
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
          transactionsLabel,
          ...sortedStackKeys.map(key => keyLabelMap[key] ?? key),
        ],
        tableData,
      };
    }, [data, t]);

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

        const transactionsLabel = t("analytics.graph.transactions");

        return (
          `${t("epochs.graph.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("epochs.graph.epoch")}: ${epoch})<hr>` +
          `<div>${params
            .map(item => {
              const value =
                item.seriesName === transactionsLabel
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
