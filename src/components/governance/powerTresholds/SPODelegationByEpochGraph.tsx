import type { FC } from "react";
import ReactECharts from "echarts-for-react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useEffect, useState } from "react";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { ThresholdsMilestone } from "@/types/governanceTypes";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";

interface DelegatedAdaOverTimeGraphProps {
  milestone: ThresholdsMilestone;
  isLoading: boolean;
  currentSupplyEpoch: number;
}

export const DelegatedAdaOverTimeGraph: FC<DelegatedAdaOverTimeGraphProps> = ({
  milestone,
  isLoading,
  currentSupplyEpoch,
}) => {
  const { textColor, bgColor, splitLineColor, inactivePageIconColor } =
    useGraphColors();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [graphsVisibility, setGraphsVisibility] = useState({
    "Delegated to SPOs": true,
  });

  const mergedEpochs = milestone?.data?.map(poolEpoch => {
    const epoch = poolEpoch.epoch_no;
    const delegated = Number(poolEpoch.stat?.pool_distr?.sum ?? 0);
    const circSupply = currentSupplyEpoch;
    const percent = (delegated / circSupply) * 100;

    return {
      epoch,
      percent: Number.isFinite(percent) ? percent : 0,
    };
  });

  const option: ReactEChartsProps["option"] = {
    legend: {
      data: ["Delegated to SPOs"],
      textStyle: { color: textColor },
      type: "scroll",
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
      selected: graphsVisibility,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: (params: any) => {
        const item = Array.isArray(params) ? params[0] : params;
        const epochNumber = +item.name;

        const { startTime, endTime } = calculateEpochTimeByNumber(
          epochNumber,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${item.name})`;
        const percentLine = `<p>${item.marker} ${item.seriesName}: ${item.value.toFixed(2)}%</p>`;

        return `${header}<hr style="margin: 4px 0;" />${percentLine}`;
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
        name: "Delegated to SPOs",
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#3B82F6" },
        z: 2,
      },
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("delegated_ada_line_graph") as string,
      );
      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "delegated_ada_line_graph",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  if (isLoading) {
    return <LoadingSkeleton height='490px' />;
  }

  return (
    <div className='relative flex w-full'>
      <GraphWatermark />
      <ReactECharts
        option={option}
        onEvents={{
          legendselectchanged: params => {
            localStorage.setItem(
              "delegated_ada_line_graph",
              JSON.stringify(params.selected),
            );
          },
        }}
        notMerge
        lazyUpdate
        className='min-h-[490px] w-full'
      />
    </div>
  );
};
