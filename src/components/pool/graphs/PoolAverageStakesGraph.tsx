import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchPoolMilestoneAnalytics } from "@/services/analytics";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { format } from "date-fns";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";

export const PoolAverageStakesGraph: FC = () => {
  const { t } = useAppTranslation("pages");
  const query = useFetchPoolMilestoneAnalytics();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(item => item.epoch_no);

  const avgPoolStake = data.map(item => {
    const sum = item.stat?.pool_distr?.sum ?? 0;
    const countPool = item.stat?.pool_distr?.count_pool_uniq ?? 1;
    return sum / countPool;
  });

  const avgBlockProducerStake = data.map(item => {
    const poolBlockVersion = item.stat?.pool_block_version ?? [];
    const totalStake = poolBlockVersion.reduce(
      (acc, curr) => acc + curr.stake,
      0,
    );
    const blockProducers = item.stat?.block_producers ?? 1;
    return totalStake / blockProducers;
  });

  const avgDelegation = data.map(item => {
    const sum = item.stat?.pool_distr?.sum ?? 0;
    const countAddr = item.stat?.pool_distr?.count_addr_uniq ?? 1;
    return sum / countAddr;
  });

  const avgPoolStakeLabel = t("pools.analytics.legend.avgPoolStake");
  const avgBlockProducerStakeLabel = t(
    "pools.analytics.legend.avgBlockProducerStake",
  );
  const avgDelegationLabel = t("pools.analytics.legend.avgDelegation");
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [avgPoolStakeLabel, avgBlockProducerStakeLabel, avgDelegationLabel],
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
          const value = formatLovelace(item.data);
          return `<p>${item.marker} ${item.seriesName}: ${value}</p>`;
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
        type: "line",
        name: avgPoolStakeLabel,
        data: avgPoolStake,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        color: "#f39c12",
      },
      {
        type: "line",
        name: avgBlockProducerStakeLabel,
        data: avgBlockProducerStake,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        color: "#35c2f5",
      },
      {
        type: "line",
        name: avgDelegationLabel,
        data: avgDelegation,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        color: "#2ecc71",
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("pools.analytics.averageStakes.title")}
      description={t("pools.analytics.averageStakes.description")}
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
