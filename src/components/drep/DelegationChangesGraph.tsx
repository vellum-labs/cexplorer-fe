import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { useFetchDelegEpochChanges } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const DelegationChangesGraph: FC = () => {
  const { t } = useAppTranslation("pages");
  const query = useFetchDelegEpochChanges();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(d => d.no);
  const stake = data.map(d => d.stat.stake);
  const count = data.map(d => d.stat.count);

  const KEYS = {
    delegatorCount: "delegatorCount",
    stakeMoved: "stakeMoved",
  };

  const legendLabels = {
    [KEYS.delegatorCount]: t("dreps.graphs.delegationChanges.delegatorCount"),
    [KEYS.stakeMoved]: t("dreps.graphs.delegationChanges.stakeMoved"),
  };

  const tooltipLabels = {
    [KEYS.delegatorCount]: t("dreps.graphs.delegationChanges.delegatorCount"),
    [KEYS.stakeMoved]: t("dreps.graphs.delegationChanges.stakeMovedShort"),
  };

  const option = {
    legend: {
      type: "scroll",
      data: [
        { name: KEYS.delegatorCount, icon: "circle" },
        { name: KEYS.stakeMoved, icon: "circle" },
      ],
      formatter: (name: string) => legendLabels[name] || name,
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
          `${t("dreps.graphs.date")} ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("dreps.graphs.epoch")} ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const value =
                item.seriesName === KEYS.stakeMoved
                  ? formatLovelace(item.data)
                  : formatNumber(item.data);

              return `<p>${item.marker} ${tooltipLabels[item.seriesName]}: ${value}</p>`;
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
        name: KEYS.delegatorCount,
        data: count,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#35c2f5" },
      },
      {
        type: "bar",
        name: KEYS.stakeMoved,
        data: stake,
        yAxisIndex: 1,
        barWidth: "60%",
        itemStyle: { color: "#f39c12" },
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("dreps.graphs.delegationChanges.title")}
      description={t("dreps.graphs.delegationChanges.description")}
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
