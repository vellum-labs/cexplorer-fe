import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useFetchStakeIsSpoDrep } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useADADisplay } from "@/hooks/useADADisplay";

export const StakeIsSpoDrepGraph: FC = () => {
  const query = useFetchStakeIsSpoDrep();
  const data = query.data?.data ?? [];

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(item => item.epoch_no);
  const count = data.map(item => item.count);
  const stake = data.map(item => item.stake);
  const delegators = data.map(item => item.delegator);

  const option = {
    legend: {
      type: "scroll",
      data: ["SPO+DRep Count", "Stake (₳)", "Delegators"],
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      confine: true,
      textStyle: { color: textColor },
      formatter: function (params) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const labelMap = {
          "Stake (₳)": "Stake",
          Delegators: "Delegators",
          "SPO+DRep Count": "SPO+DRep Count",
        };

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const value =
                item.seriesName === "Stake (₳)"
                  ? formatLovelace(item.data)
                  : formatNumber(item.data);
              return `<p>${item.marker} ${labelMap[item.seriesName]}: ${value}</p>`;
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
        axisLabel: { show: false, color: textColor },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: textColor } },
      },
    ],
    series: [
      {
        type: "line",
        name: "SPO+DRep Count",
        data: count,
        yAxisIndex: 0,
        symbol: "none",
        lineStyle: { color: "#35c2f5" },
        itemStyle: {
          color: "#35c2f5",
        },
        showSymbol: false,
      },
      {
        type: "line",
        name: "Stake (₳)",
        data: stake,
        yAxisIndex: 1,
        symbol: "none",
        lineStyle: { color: "#f39c12" },
        itemStyle: {
          color: "#f39c12",
        },
        showSymbol: false,
      },
      {
        type: "line",
        name: "Delegators",
        data: delegators,
        yAxisIndex: 0,
        symbol: "none",
        lineStyle: { color: "#2ecc71" },
        itemStyle: {
          color: "#2ecc71",
        },
        showSymbol: false,
      },
    ],
  };

  return (
    <AnalyticsGraph
      title='Stake delegated to entities that are both SPOs and DRep'
      description='Stake, DRep count, and delegator count delegated to entities serving as both SPOs and DRep'
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
