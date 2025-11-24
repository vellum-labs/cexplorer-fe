import type { DeFiTokenStatData } from "@/types/tokenTypes";
import type { FC } from "react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useMemo } from "react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useGraphColors } from "@/hooks/useGraphColors";

interface TokenDashboardDexTradesGraphProps {
  data: DeFiTokenStatData[] | undefined;
}

export const TokenDashboardDexTradesGraph: FC<
  TokenDashboardDexTradesGraphProps
> = ({ data }) => {
  const { theme } = useThemeStore();
  const { textColor, bgColor } = useGraphColors();
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

  const colorPalette = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ];

  const option = {
    color: colorPalette,
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        const header = "<b>Market share</b><br/><br/>";

        const sortedItems = [...aggregated]
          .filter(item => (item.value / total) * 100 >= 1)
          .sort((a, b) => b.value - a.value);

        const items = sortedItems
          .map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(2);
            const isHovered = item.name === params.name;
            const color = colorPalette[index % colorPalette.length];
            return `${isHovered ? "<b>" : ""}<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${color};"></span>${item.name}: ${percent}%${isHovered ? "</b>" : ""}`;
          })
          .join("<br/>");
        return header + items;
      },
    },
    series: [
      {
        name: "DEX",
        type: "pie",
        radius: "60%",
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

  if (!data) {
    return (
      <AnalyticsGraph className='w-full border-none xl:w-[550px]' exportButton>
        <LoadingSkeleton height='490px' width='100%' rounded='full' />
      </AnalyticsGraph>
    );
  }

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
