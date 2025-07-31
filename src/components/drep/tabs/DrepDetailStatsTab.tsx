import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import ReactEcharts from "echarts-for-react";
import { memo, useRef } from "react";
import type { DrepDistrDetail } from "@/types/drepTypes";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

interface DrepDetailStatsTabProps {
  data: DrepDistrDetail[];
}

export const DrepDetailStatsTab = memo(function DrepDetailStatsTabMemo({
  data,
}: DrepDetailStatsTabProps) {
  const { data: miscBasic } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(miscBasic?.data.version.const);
  const { textColor, bgColor } = useGraphColors();
  const chartRef = useRef(null);

  const epochs = data?.map(item => item.epoch_no).reverse() ?? [];
  const powerSeries = data?.map(item => Number(item.power)).reverse() ?? [];
  const delegatorsSeries =
    data?.map(item => item.represented_by).reverse() ?? [];

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
          Power: item => (item ? lovelaceToAda(item.data) : "Power"),
          Delegators: item => (item ? `${item.data} delegators` : "Delegators"),
        };

        return (
          `Date: ${format(startTime, "dd.MM.yy")} – ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0].axisValue})<hr/>` +
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
      name: "Epoch",
      nameLocation: "middle",
      nameGap: 28,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        name: "Power",
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 40,
        axisLabel: { show: false },
      },
      {
        type: "value",
        name: "Delegators",
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
        name: "Power",
        yAxisIndex: 0,
        data: powerSeries,
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
        areaStyle: { opacity: 0.12 },
      },
      {
        type: "line",
        name: "Delegators",
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
