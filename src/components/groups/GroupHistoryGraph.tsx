import type { FC } from "react";
import { useMemo } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import type { GroupDetailData } from "@/types/analyticsTypes";

interface GroupHistoryGraphProps {
  items: GroupDetailData["items"];
}

interface HistItem {
  stake: number;
  delegator: number;
}

export const GroupHistoryGraph: FC<GroupHistoryGraphProps> = ({ items }) => {
  const { t } = useAppTranslation("pages");
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const aggregatedData = useMemo(() => {
    const epochMap = new Map<number, { stake: number; delegators: number }>();
    const poolItems = items?.filter(item => item.type === "pool") ?? [];

    poolItems.forEach(item => {
      const hist = (item.info[0] as any)?.hist as HistItem[] | undefined;
      if (!hist) return;

      hist.forEach((histItem, index) => {
        const currentEpoch = miscConst?.epoch?.no ?? 0;
        const epochNo = currentEpoch - (hist.length - 1 - index);

        const existing = epochMap.get(epochNo) ?? { stake: 0, delegators: 0 };
        epochMap.set(epochNo, {
          stake: existing.stake + (histItem.stake ?? 0),
          delegators: existing.delegators + (histItem.delegator ?? 0),
        });
      });
    });

    return Array.from(epochMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([epoch, data]) => ({
        epoch,
        stake: data.stake,
        delegators: data.delegators,
      }));
  }, [items, miscConst?.epoch?.no]);

  const epochs = aggregatedData.map(item => item.epoch);
  const stakes = aggregatedData.map(item => item.stake);
  const delegators = aggregatedData.map(item => item.delegators);

  const stakeLabel = t("groups.analytics.legend.totalStake");
  const delegatorsLabel = t("groups.analytics.legend.totalDelegators");
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [stakeLabel, delegatorsLabel],
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
      axisPointer: {
        type: "line",
        lineStyle: { color: "#35c2f5" },
      },
      formatter: function (params: any) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `${dateLabel}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${epochLabel}: ${params[0]?.axisValue})<hr style="margin: 4px 0;" />`;

        const lines = params.map((item: any) => {
          const isStake = item.seriesName.includes("Stake");
          const value = isStake
            ? formatLovelace(item.data)
            : formatNumber(item.data);
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
        name: stakeLabel,
        data: stakes,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        color: "#f39c12",
      },
      {
        type: "line",
        name: delegatorsLabel,
        data: delegators,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        color: "#35c2f5",
      },
    ],
  };

  if (aggregatedData.length === 0) {
    return null;
  }

  return (
    <AnalyticsGraph
      title={t("groups.analytics.history.title")}
      description={t("groups.analytics.history.description")}
      className='mb-2 border-border'
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
