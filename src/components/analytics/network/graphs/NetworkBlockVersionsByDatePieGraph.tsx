import type { useFetchAnalyticsRate } from "@/services/analytics";
import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { getColorForVersion } from "@/utils/getColorByVersion";
import { useGraphColors } from "@/hooks/useGraphColors";

interface NetworkBlockVersionsByDatePieGraphProps {
  query: ReturnType<typeof useFetchAnalyticsRate>;
  day: number;
}

export const NetworkBlockVersionsByDatePieGraph: FC<
  NetworkBlockVersionsByDatePieGraphProps
> = ({ query, day }) => {
  const { textColor, bgColor } = useGraphColors();

  const { data: rateData } = query;

  const data = rateData?.data.slice(0, day);

  const versionCounts = (data ?? [])?.reduce((acc, day) => {
    if (day.stat?.block_version) {
      (day.stat as any).block_version.forEach(versionData => {
        const version = `${versionData.version}`;
        if (acc[version]) {
          acc[version] += versionData.count;
        } else {
          acc[version] = versionData.count;
        }
      });
    }

    return acc;
  }, {});

  const pieData = Object.entries(versionCounts || {}).map(
    ([version, count]) => ({
      value: count,
      name: version,
      itemStyle: {
        color: getColorForVersion(+version),
      },
    }),
  );

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: bgColor,
      confine: true,
      textStyle: {
        color: textColor,
      },
      formatter: param => {
        const { marker, name, value, seriesName } = param;
        return `
      <div style=" margin-bottom: 5px;">${seriesName}</div>
      <div style="margin-top: 4px;">
        ${marker} <span style="margin-right: 6px;">${name}:</span>
        ${value}
      </div>
    `;
      },
    },
    series: [
      {
        name: "Block Versions",
        type: "pie",
        radius: ["40%", "60%"],
        avoidLabelOverlap: false,
        labelLayout: { hideOverlap: true },
        label: {
          show: true,
          position: "outside",
          formatter: "{d}%",
          color: textColor,
        },
        labelLine: {
          show: true,
          length: 5,
          length2: 3,
          smooth: true,
        },
        data: pieData,
      },
    ],
  };

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='h-full w-full'
      />
    </div>
  );
};
