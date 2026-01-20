import type { FC } from "react";
import type { DeFiTokenStatData } from "@/types/tokenTypes";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useMemo } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TokenDashboardRevenueGraphProps {
  data: DeFiTokenStatData[] | undefined;
}

export const TokenDashboardRevenueGraph: FC<
  TokenDashboardRevenueGraphProps
> = ({ data }) => {
  const { t } = useAppTranslation("common");
  const { textColor, bgColor } = useGraphColors();

  const { xAxisData, seriesData } = useMemo(() => {
    const dexMap = new Map<string, Record<string, number>>();
    const allDates = new Set<string>();

    (data ?? []).forEach(entry => {
      if (!entry || !entry.update_date || !Array.isArray(entry.details)) return;

      const date = new Date(entry.update_date);
      if (isNaN(date.getTime())) return;

      const formattedDate = date.toLocaleDateString("cs-CZ");
      allDates.add(formattedDate);

      entry.details.forEach(detail => {
        if (
          !detail ||
          typeof detail.dex !== "string" ||
          typeof detail.total !== "number" ||
          detail.total <= 0
        ) {
          return;
        }

        const dexName =
          detail.dex.charAt(0) + detail.dex.slice(1).toLowerCase();

        if (!dexMap.has(dexName)) {
          dexMap.set(dexName, {});
        }

        const dateTotals = dexMap.get(dexName)!;
        dateTotals[formattedDate] =
          (dateTotals[formattedDate] || 0) + detail.total;
      });
    });

    const sortedDates = Array.from(allDates);

    const dexTotals: Record<string, number> = {};
    dexMap.forEach((totals, dex) => {
      dexTotals[dex] = Object.values(totals).reduce((sum, v) => sum + v, 0);
    });

    const sortedDexEntries = Array.from(dexMap.entries()).sort(
      ([a], [b]) => dexTotals[b] - dexTotals[a],
    );

    const series = sortedDexEntries.map(([dex, totals]) => ({
      name: dex,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: sortedDates.map(date => totals[date] || 0),
    }));

    return {
      xAxisData: sortedDates,
      seriesData: series,
    };
  }, [data]);

  const option = {
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: { type: "shadow" },
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        if (!params || params.length === 0) return "";

        const date = params[0].axisValue;
        const total = params.reduce(
          (sum: number, item: any) => sum + item.value,
          0,
        );

        let result = `<b>${t("tokenDashboard.graph.tradingVolume")}</b><br/>${date}<br/><br/>`;
        result += `<b>${t("tokenDashboard.graph.total")}: ${total.toLocaleString()}</b><br/><br/>`;

        const sortedParams = [...params].sort(
          (a: any, b: any) => b.value - a.value,
        );

        sortedParams.forEach((item: any) => {
          if (item.value > 0) {
            result += `${item.marker} ${item.seriesName}: ${item.value.toLocaleString()}<br/>`;
          }
        });

        return result;
      },
    },
    legend: {
      top: 10,
      right: 10,
      textStyle: {
        color: textColor,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: xAxisData,
        inverse: true,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: seriesData,
  };

  if (!data) {
    return (
      <AnalyticsGraph className='border-none' exportButton>
        <LoadingSkeleton height='490px' width='100%' rounded='full' />
      </AnalyticsGraph>
    );
  }

  return (
    <AnalyticsGraph className='border-none' exportButton>
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full min-h-[400px] w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
