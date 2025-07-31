import type { useFetchBlocksList } from "@/services/blocks";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { memo } from "react";

import { useLatestBlocks } from "@/hooks/graphs/useLatestBlocks";

interface NetworkBlockVersionsLatestBlocksGraphProps {
  query: ReturnType<typeof useFetchBlocksList>;
  sortedVersions: [string, number][] | [string, unknown][];
}

export const NetworkBlockVersionsLatestBlocksGraph: FC<NetworkBlockVersionsLatestBlocksGraphProps> =
  memo(function NetworkBlockVersionsLatestBlocksGraph({
    query,
    sortedVersions,
  }) {
    const safeSortedVersions: [string, number][] = (
      sortedVersions as [string, unknown][]
    ).map(([k, v]) => [k, Number(v)]) as [string, number][];
    const { onEvents, option } = useLatestBlocks({
      query,
      sortedVersions: safeSortedVersions,
    });

    return (
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          onEvents={{
            click: onEvents,
          }}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    );
  });
