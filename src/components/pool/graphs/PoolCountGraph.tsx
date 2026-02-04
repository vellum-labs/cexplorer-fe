import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchPoolMilestoneAnalytics } from "@/services/analytics";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";

export const PoolCountGraph: FC = () => {
  const { t } = useAppTranslation("pages");
  const query = useFetchPoolMilestoneAnalytics();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const epochs = data.map(item => item.epoch_no);
  const registeredPools = data.map(
    item => item.stat?.pool_distr?.count_pool_uniq ?? 0,
  );
  const blockProducingPools = data.map(item => item.stat?.block_producers ?? 0);

  const registeredPoolsLabel = t("pools.analytics.legend.registeredPools");
  const blockProducingPoolsLabel = t(
    "pools.analytics.legend.blockProducingPools",
  );
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [registeredPoolsLabel, blockProducingPoolsLabel],
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
          const value = formatNumber(item.data);
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
    ],
    series: [
      {
        type: "line",
        name: registeredPoolsLabel,
        data: registeredPools,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        color: "#f39c12",
      },
      {
        type: "line",
        name: blockProducingPoolsLabel,
        data: blockProducingPools,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        color: "#35c2f5",
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("pools.analytics.poolCount.title")}
      description={t("pools.analytics.poolCount.description")}
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
