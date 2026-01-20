import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import ReactEcharts from "echarts-for-react";
import { memo, useRef } from "react";
import type { DrepDistrDetail } from "@/types/drepTypes";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DrepDetailStatsTabProps {
  data: DrepDistrDetail[];
}

export const DrepDetailStatsTab = memo(function DrepDetailStatsTabMemo({
  data,
}: DrepDetailStatsTabProps) {
  const { t } = useAppTranslation("pages");
  const { data: miscBasic } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(miscBasic?.data.version.const);
  const { formatLovelace } = useADADisplay();
  const { textColor, bgColor } = useGraphColors();
  const chartRef = useRef(null);

  const epochs = data?.map(item => item.epoch_no).reverse() ?? [];
  const powerSeries = data?.map(item => Number(item.power)).reverse() ?? [];
  const delegatorsSeries =
    data?.map(item => item.represented_by).reverse() ?? [];

  const powerLabel = t("dreps.detailPage.statsGraph.power");
  const delegatorsLabel = t("dreps.detailPage.statsGraph.delegators");
  const epochLabel = t("dreps.detailPage.statsGraph.epoch");
  const dateLabel = t("dreps.detailPage.statsGraph.date");

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      confine: true,
      textStyle: { color: textColor },
      formatter: function (params) {
        const marker = dataPoint => dataPoint?.marker;
        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch?.no ?? 0,
          miscConst?.epoch?.start_time ?? "",
        );

        const nameFunc = {
          [powerLabel]: item => (item ? formatLovelace(item.data) : powerLabel),
          [delegatorsLabel]: item =>
            item
              ? `${item.data} ${delegatorsLabel.toLowerCase()}`
              : delegatorsLabel,
        };

        return (
          `${dateLabel}: ${format(startTime, "dd.MM.yy")} – ${format(endTime, "dd.MM.yy")} (${epochLabel}: ${params[0].axisValue})<hr/>` +
          params
            .map(
              item =>
                `<p>${marker(item)} ${item.seriesName}: ${nameFunc[item.seriesName]?.(item)}</p>`,
            )
            .join("")
        );
      },
    },
    legend: {
      type: "plain",
      top: 10,
      textStyle: { color: textColor },
    },
    grid: {
      top: 50,
      left: 40,
      right: 20,
      bottom: 40,
    },
    xAxis: {
      type: "category",
      data: epochs,
      inverse: false,
      name: epochLabel,
      nameLocation: "middle",
      nameGap: 28,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        name: powerLabel,
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 40,
        axisLabel: { show: false },
      },
      {
        type: "value",
        name: delegatorsLabel,
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 40,
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: "line",
        name: powerLabel,
        yAxisIndex: 0,
        data: powerSeries,
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
        areaStyle: { opacity: 0.12 },
      },
      {
        type: "line",
        name: delegatorsLabel,
        yAxisIndex: 1,
        data: delegatorsSeries,
        itemStyle: { color: "#35c2f5" },
        showSymbol: false,
      },
    ],
  };

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 400 }}
        ref={chartRef}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='h-full min-h-[400px] w-full'
      />
    </div>
  );
});
