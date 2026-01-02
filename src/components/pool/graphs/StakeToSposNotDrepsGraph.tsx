import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchStakeDrepsNotSpo } from "@/services/pools";

import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";

export const StakeToSposNotDrepsGraph: FC = () => {
  const query = useFetchStakeDrepsNotSpo();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(item => item.epoch_no);
  const stake = data.map(item => item.stake);
  const count = data.map(item => item.count);
  const delegators = data.map(item => item.delegator);

  const option = {
    legend: {
      type: "scroll",
      data: ["Stake (₳)", "Count", "Delegators"],
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: function (params) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(
          endTime,
          "dd.MM.yy",
        )} (Epoch: ${params[0]?.axisValue})<hr style="margin: 4px 0;" />`;

        const lines = params.map(item => {
          const isStake = item.seriesName.includes("Stake");
          const cleanName = item.seriesName.replace(" (₳)", "");

          const value = isStake
            ? formatLovelace(item.data)
            : formatNumber(item.data);

          return `<p>${item.marker} ${cleanName}: ${value}</p>`;
        });

        return header + lines.join("");
      },
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 18,
    },
    xAxis: {
      type: "category",
      data: epochs,
      name: "Epoch",
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      inverse: true,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: false,
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: "value",
        position: "right",
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: false,
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: "line",
        name: "Stake (₳)",
        data: stake,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#f39c12" },
      },
      {
        type: "line",
        name: "Count",
        data: count,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#35c2f5" },
      },
      {
        type: "line",
        name: "Delegators",
        data: delegators,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#2ecc71" },
      },
    ],
  };

  return (
    <AnalyticsGraph
      title='Stake delegated to SPOs that are not DReps'
      description='Epoch-level view of stake, SPO count, and delegator count delegated to SPOs who are not DReps'
      className='border-none'
    >
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
