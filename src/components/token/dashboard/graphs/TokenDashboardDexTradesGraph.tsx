import type { DeFiTokenStatData } from "@/types/tokenTypes";
import type { FC } from "react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useMemo } from "react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

interface TokenDashboardDexTradesGraphProps {
  data: DeFiTokenStatData[] | undefined;
}

export const TokenDashboardDexTradesGraph: FC<
  TokenDashboardDexTradesGraphProps
> = ({ data }) => {
  const { theme } = useThemeStore();
  const aggregated = useMemo(() => {
    const counts: Record<string, number> = {};

    (data ?? []).forEach(({ details }) => {
      details.forEach(({ dex, total }) => {
        counts[dex] = (counts[dex] || 0) + total;
      });
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const total = aggregated.reduce((sum, item) => sum + item.value, 0);

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      formatter: (params: any) => {
        return aggregated
          .filter(item => (item.value / total) * 100 >= 1)
          .map(item => {
            const percent = ((item.value / total) * 100).toFixed(2);
            const isHovered = item.name === params.name;
            return `${isHovered ? "<b>" : ""}${item.name}: ${percent}%${isHovered ? "</b>" : ""}`;
          })
          .join("<br/>");
      },
    },
    series: [
      {
        name: "DEX",
        type: "pie",
        radius: "60%",
        // center: ["50%", "60%"],
        data: aggregated,
        avoidLabelOverlap: false,
        labelLayout: { hideOverlap: true },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{d}%",
          color: theme === "light" ? "#475467" : "#9fa3a8",
          fontSize: 10,
        },
        labelLine: {
          show: true,
          length: 8,
          length2: 5,
          smooth: true,
        },
      },
    ],
  };

  return (
    <AnalyticsGraph className='w-full border-none xl:w-[550px]' exportButton>
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
