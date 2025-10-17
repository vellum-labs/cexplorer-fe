import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { useFetchDelegEpochChanges } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

export const DelegationChangesGraph: FC = () => {
  const query = useFetchDelegEpochChanges();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const epochs = data.map(d => d.no);
  const stake = data.map(d => d.stat.stake);
  const count = data.map(d => d.stat.count);

  const option = {
    legend: {
      type: "scroll",
      data: ["Delegator Count", "Stake Moved (₳)"],
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

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const name =
                item.seriesName === "Stake Moved (₳)"
                  ? "Stake Moved"
                  : item.seriesName;

              const value =
                item.seriesName === "Stake Moved (₳)"
                  ? lovelaceToAda(item.data)
                  : formatNumber(item.data);

              return `<p>${item.marker} ${name}: ${value}</p>`;
            })
            .join("")
        );
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
        nameTextStyle: { color: textColor },
        axisLabel: false,
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        nameTextStyle: { color: textColor },
        axisLabel: false,
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: textColor } },
      },
    ],
    series: [
      {
        type: "line",
        name: "Delegator Count",
        data: count,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#35c2f5" },
      },
      {
        type: "bar",
        name: "Stake Moved (₳)",
        data: stake,
        yAxisIndex: 1,
        barWidth: "60%",
        itemStyle: { color: "#f39c12" },
      },
    ],
  };

  return (
    <AnalyticsGraph
      title='Delegators & Stake Changing both Voting and Minting Delegation'
      description='Epoch-by-epoch changes in delegators and stake switching voting or minting delegation'
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
