import type { FC } from "react";
import type { NetworkBlockGraphProps } from "../tabs/NetworkBlocksTab";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";
import { AnalyticsGraph } from "../../AnalyticsGraph";

import { useBlockSizeUsed } from "@/hooks/graphs/useBlockSizeUsed";

export const NetworkBlockSizeGraph: FC<NetworkBlockGraphProps> = ({
  epochQuery,
  miscConst,
}) => {
  const { json, option, selectedItem, setData, setSelectedItem } =
    useBlockSizeUsed(miscConst);

  return (
    <AnalyticsGraph
      title='Block size used'
      description='This graph tracks the average block size on Cardano over time, highlighting how the network is currently utilizing the 88KB maximum block size capacity.'
      exportButton
      graphSortData={{
        query: epochQuery,
        selectedItem,
        setSelectedItem,
        setData,
      }}
      csvJson={json}
    >
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
