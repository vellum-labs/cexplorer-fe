import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import type { ThresholdsMilestone } from "@/types/governanceTypes";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

interface DelegatedAdaToDRepsOverTimeGraphProps {
  milestone: ThresholdsMilestone;
  isLoading: boolean;
  currentSupplyEpoch: number;
}

export const DelegatedAdaToDRepsOverTimeGraph: FC<
  DelegatedAdaToDRepsOverTimeGraphProps
> = ({ milestone, isLoading, currentSupplyEpoch }) => {
  const { textColor, bgColor, splitLineColor, inactivePageIconColor } =
    useGraphColors();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const mergedEpochs = milestone?.data?.map(drepEpoch => {
    const epoch = drepEpoch.epoch_no;
    const delegated = Number(drepEpoch.stat?.drep_distr?.sum ?? 0);
    const countDReps = drepEpoch.stat?.drep_distr?.count_uniq ?? null;

    const circSupply = currentSupplyEpoch;

    const percent = (delegated / circSupply) * 100;

    return {
      epoch,
      percent: Number.isFinite(percent) ? percent : 0,
      countDReps,
    };
  });

  const option = {
    legend: {
      data: ["Delegated to DReps"],
      textStyle: { color: textColor },
      type: "scroll",
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      confine: true,
      textStyle: { color: textColor },
      formatter: (params: any) => {
        const item = Array.isArray(params) ? params[0] : params;
        const epoch = mergedEpochs?.[item.dataIndex];

        const { startTime, endTime } = calculateEpochTimeByNumber(
          +item.name,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${item.name})`;
        const percentLine = `<p>${item.marker} ${item.seriesName}: ${item.value.toFixed(2)}%</p>`;
        const drepLine = `<p style="padding-left: 18px;">Unique DReps: ${epoch?.countDReps ?? "–"}</p>`;

        return `${header}<hr style="margin: 4px 0;" />${percentLine}${drepLine}`;
      },
    },
    grid: {
      left: 20,
      right: 40,
      top: 40,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: mergedEpochs.map(e => e.epoch),
      name: "Epoch",
      nameLocation: "middle",
      nameGap: 28,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
      inverse: true,
    },
    yAxis: {
      type: "value",
      axisLabel: { color: textColor, formatter: "{value}%" },
      axisLine: { lineStyle: { color: textColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    series: [
      {
        type: "line",
        data: mergedEpochs.map(e => e.percent),
        name: "Delegated to DReps",
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#3B82F6" },
        z: 2,
      },
    ],
  };

  if (isLoading) {
    return <LoadingSkeleton height='490px' />;
  }

  return (
    <div className='relative flex w-full'>
      <GraphWatermark />
      <ReactECharts
        option={option}
        notMerge
        lazyUpdate
        className='min-h-[490px] w-full'
      />
    </div>
  );
};
