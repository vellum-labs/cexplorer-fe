import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { colors } from "@/constants/colors";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import type { ScriptStatItem } from "@/types/scriptTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import ReactEcharts from "echarts-for-react";
import { BarChart, FileBarChart, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

export const ScriptDetailStatsTab = ({
  items,
}: {
  items: ScriptStatItem[] | undefined;
}) => {
  const { theme } = useThemeStore();
  const { bgColor, lineColor, splitLineColor, textColor } = useGraphColors();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

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
    Interactions: true,
    Output: true,
    "Average Output": true,
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
      data: ["Interactions", "Output", "Average Output"],
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
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${epochNumber})<hr>` +
          `<div>
            ${params
              .map(item => {
                let formattedValue: string;
                if (item.data == null || isNaN(Number(item.data))) {
                  formattedValue = "—";
                } else if (item.seriesName.includes("Output")) {
                  formattedValue = lovelaceToAda(Number(item.data));
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
      name: "Epoch",
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
        name: "Amount",
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
        name: "Output",
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
        name: "Interactions",
        yAxisIndex: 0,
        itemStyle: { opacity: 0.7, color: "#e3033a" },
      },
      {
        type: "line",
        data: output,
        name: "Output",
        yAxisIndex: 1,
        showSymbol: false,
        itemStyle: { color: lineColor },
        lineStyle: { color: lineColor },
        areaStyle: { opacity: 0.2, color: lineColor },
      },
      {
        type: "line",
        data: averageOutput,
        name: "Average Output",
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
          title='Volume'
          value={
            items ? (
              <AdaWithTooltip data={items[0].item.data.redeemer.sum} />
            ) : (
              "-"
            )
          }
          icon={<BarChart color={colors.primary} />}
          description='In the past epoch'
        />
        <OverviewStatCard
          title='Users'
          value={items ? formatNumber(items[0].item.data.redeemer.stake) : "-"}
          icon={<Users color={colors.primary} />}
          description='Unique users in the past epoch'
        />
        <OverviewStatCard
          title='Interactions'
          value={items ? formatNumber(items[0].item.data.redeemer.count) : "-"}
          icon={<FileBarChart color={colors.primary} />}
          description='Average interactions per user'
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
