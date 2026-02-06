import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchStakeDrepsNotSpo } from "@/services/pools";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";

export const StakeToSposNotDrepsGraph: FC = () => {
  const { t } = useAppTranslation("pages");
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

  const stakeLabel = t("pools.analytics.legend.stake");
  const countLabel = t("pools.analytics.legend.count");
  const delegatorsLabel = t("pools.analytics.legend.delegators");
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [stakeLabel, countLabel, delegatorsLabel],
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
      axisPointer: {
        type: "line",
        lineStyle: { color: "#35c2f5" },
      },
      formatter: function (params) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `${dateLabel}: ${format(startTime, "dd.MM.yy")} - ${format(
          endTime,
          "dd.MM.yy",
        )} (${epochLabel}: ${params[0]?.axisValue})<hr style="margin: 4px 0;" />`;

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
      {
        type: "value",
        position: "right",
        offset: 30,
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: false,
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: "line",
        name: stakeLabel,
        data: stake,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        color: "#f39c12",
      },
      {
        type: "line",
        name: countLabel,
        data: count,
        yAxisIndex: 2,
        symbol: "none",
        showSymbol: false,
        color: "#35c2f5",
      },
      {
        type: "line",
        name: delegatorsLabel,
        data: delegators,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        color: "#2ecc71",
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("pools.analytics.stakeToSposNotDreps.title")}
      description={t("pools.analytics.stakeToSposNotDreps.description")}
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
