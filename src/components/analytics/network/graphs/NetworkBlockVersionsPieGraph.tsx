import type { useFetchBlocksList } from "@/services/blocks";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { getColorForVersion } from "@/utils/getColorByVersion";

import { useGraphColors } from "@/hooks/useGraphColors";

interface NetworkBlockVersionsPieGraphProps {
  query: ReturnType<typeof useFetchBlocksList>;
}

export const NetworkBlockVersionsPieGraph: FC<
  NetworkBlockVersionsPieGraphProps
> = ({ query }) => {
  const { data } = query;
  const blockData = data?.pages.flatMap(x => x.data.data);
  const { textColor, bgColor } = useGraphColors();

  const versionCounts = blockData?.reduce((acc, block) => {
    const version = `${block.proto_major}.${block.proto_minor}`;
    if (acc[version]) {
      acc[version] += 1;
    } else {
      acc[version] = 1;
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
