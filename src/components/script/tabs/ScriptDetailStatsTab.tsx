import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { colors } from "@/constants/colors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import type { ScriptStatItem } from "@/types/scriptTypes";
import { formatNumber, lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import ReactEcharts from "echarts-for-react";
import { BarChart, FileBarChart, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ScriptDetailStatsTab = ({
  items,
}: {
  items: ScriptStatItem[] | undefined;
}) => {
  const { t } = useAppTranslation("common");
  const { theme } = useThemeStore();
  const { formatLovelace } = useADADisplay();
  const { bgColor, lineColor, splitLineColor, textColor } = useGraphColors();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const legendLabels = {
    interactions: t("script.stats.graph.interactions"),
    output: t("script.stats.graph.output"),
    averageOutput: t("script.stats.graph.averageOutput"),
  };

  const interactions = items?.map(item => item?.item?.data?.redeemer?.count);
  const output = items?.map(item =>
    item.item.data.tx_payment_cred?.out
      ? item.item.data.tx_payment_cred?.out.sum
      : 0,
  );
  const averageOutput = items?.map(item =>
    item.item.data.tx_payment_cred?.out
      ? Math.round(
          item.item.data.tx_payment_cred?.out.sum /
            item.item.data.redeemer.count,
        )
      : 0,
  );

  const chartRef = useRef(null);

  const [graphsVisibility, setGraphsVisibility] = useState({
    [legendLabels.interactions]: true,
    [legendLabels.output]: true,
    [legendLabels.averageOutput]: true,
  });

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: theme === "dark" ? "white" : "#101828",
      pageIconInactiveColor: "#858585",
      pageTextStyle: {
        color: theme === "dark" ? "white" : "#101828",
      },
      type: "scroll",
      data: [legendLabels.interactions, legendLabels.output, legendLabels.averageOutput],
      textStyle: { color: textColor },
      selected: Object.fromEntries(Object.entries(graphsVisibility)),
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: function (params) {
        if (!params || params.length === 0) return "";

        const marker = dataPoint => dataPoint?.marker || "";
        const epochNumber = +params[0]?.axisValue;
        const { startTime, endTime } = calculateEpochTimeByNumber(
          epochNumber,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        return (
          `${t("script.stats.graph.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("script.stats.graph.epoch")}: ${epochNumber})<hr>` +
          `<div>
            ${params
              .map(item => {
                let formattedValue: string;
                if (item.data == null || isNaN(Number(item.data))) {
                  formattedValue = "—";
                } else if (item.seriesName.includes(legendLabels.output)) {
                  formattedValue = formatLovelace(Number(item.data));
                } else {
                  formattedValue = formatNumber(Number(item.data));
                }
                return `<p style="margin: 2px 0;">${marker(item)} ${item.seriesName}: ${formattedValue}</p>`;
              })
              .join("")}
          </div>`
        );
      },
    },
    grid: {
      top: 40,
      right: 60,
      bottom: 40,
      left: 60,
    },
    xAxis: {
      type: "category",
      data: items?.map(item => item.item.epoch_no),
      inverse: true,
      name: t("script.stats.graph.epoch"),
      nameLocation: "middle",
      nameGap: 28,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        show: true,
        name: t("script.stats.graph.amount"),
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 45,
        id: "0",
        axisLabel: {
          color: textColor,
          formatter: value => formatNumber(value),
        },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        id: "1",
        show: true,
        name: legendLabels.output,
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 49,
        offset: 0,
        axisLabel: {
          color: textColor,
          formatter: value => lovelaceToAda(value),
        },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        id: "2",
        axisLabel: { show: false, color: textColor },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
    ],
    series: [
      {
        type: "bar",
        data: interactions,
        name: legendLabels.interactions,
        yAxisIndex: 0,
        itemStyle: { opacity: 0.7, color: "#e3033a" },
      },
      {
        type: "line",
        data: output,
        name: legendLabels.output,
        yAxisIndex: 1,
        showSymbol: false,
        itemStyle: { color: lineColor },
        lineStyle: { color: lineColor },
        areaStyle: { opacity: 0.2, color: lineColor },
      },
      {
        type: "line",
        data: averageOutput,
        name: legendLabels.averageOutput,
        yAxisIndex: 2,
        showSymbol: false,
        itemStyle: { color: textColor },
      },
    ],
  };

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("script_detail_stats_graph_store") as string,
      );
      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "script_detail_stats_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  return (
    <div>
      <div className='flex flex-wrap gap-2'>
        <OverviewStatCard
          title={t("script.stats.volume")}
          value={
            items ? (
              <AdaWithTooltip data={items[0].item.data.redeemer.sum} />
            ) : (
              "-"
            )
          }
          icon={<BarChart color={colors.primary} />}
          description={t("script.stats.inPastEpoch")}
        />
        <OverviewStatCard
          title={t("script.stats.users")}
          value={items ? formatNumber(items[0].item.data.redeemer.stake) : "-"}
          icon={<Users color={colors.primary} />}
          description={t("script.stats.uniqueUsersInPastEpoch")}
        />
        <OverviewStatCard
          title={t("script.stats.interactions")}
          value={items ? formatNumber(items[0].item.data.redeemer.count) : "-"}
          icon={<FileBarChart color={colors.primary} />}
          description={t("script.stats.averageInteractionsPerUser")}
        />
      </div>
      <div className='relative mt-4 w-full'>
        <GraphWatermark />
        <ReactEcharts
          opts={{ height: 400 }}
          onChartReady={onChartReadyCallback}
          onEvents={{
            legendselectchanged: params => {
              localStorage.setItem(
                "script_detail_stats_graph_store",
                JSON.stringify(params.selected),
              );
            },
          }}
          option={option}
          notMerge
          lazyUpdate
          className='h-full min-h-[400px] w-full'
        />
      </div>
    </div>
  );
};
