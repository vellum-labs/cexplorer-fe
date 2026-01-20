import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useFetchStakeIsSpoDrep } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useADADisplay } from "@/hooks/useADADisplay";

export const StakeIsSpoDrepGraph: FC = () => {
  const { t } = useAppTranslation("pages");
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

  const stakeLabel = t("pools.analytics.legend.stake");
  const spoDrepCountLabel = t("pools.analytics.legend.spoDrepCount");
  const delegatorsLabel = t("pools.analytics.legend.delegators");
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [spoDrepCountLabel, stakeLabel, delegatorsLabel],
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
          [stakeLabel]: stakeLabel.replace(" (₳)", ""),
          [delegatorsLabel]: delegatorsLabel,
          [spoDrepCountLabel]: spoDrepCountLabel,
        };

        return (
          `${dateLabel}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${epochLabel}: ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const value =
                item.seriesName === stakeLabel
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
      name: epochLabel,
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
        name: spoDrepCountLabel,
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
        name: stakeLabel,
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
        name: delegatorsLabel,
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
      title={t("pools.analytics.stakeToSpoDreps.title")}
      description={t("pools.analytics.stakeToSpoDreps.description")}
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
