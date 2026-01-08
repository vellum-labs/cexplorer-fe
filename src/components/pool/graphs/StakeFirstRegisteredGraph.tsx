import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchDelegEpochRegistered } from "@/services/pools";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";

export const StakeFirstRegisteredGraph: FC = () => {
  const { t } = useAppTranslation("pages");
  const query = useFetchDelegEpochRegistered();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(item => item.no);
  const counts = data.map(item => item.stat.count);
  const stakes = data.map(item => item.stat.stake);

  const stakeLabel = t("pools.analytics.legend.stake");
  const countLabel = t("pools.analytics.legend.count");
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [stakeLabel, countLabel],
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      confine: true,
      formatter: function (params) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `${dateLabel}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${epochLabel}: ${params[0]?.axisValue})<hr style="margin: 4px 0;" />`;

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
    ],
    series: [
      {
        type: "bar",
        name: stakeLabel,
        data: stakes,
        yAxisIndex: 1,
        itemStyle: { color: "#f39c12" },
      },
      {
        type: "line",
        name: countLabel,
        data: counts,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#35c2f5" },
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("pools.analytics.firstTimeRegistrations.title")}
      description={t("pools.analytics.firstTimeRegistrations.description")}
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
