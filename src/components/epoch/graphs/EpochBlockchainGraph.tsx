import type { BasicRate } from "@/types/miscTypes";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useMemo } from "react";
import { useEpochBlockchain } from "@/hooks/graphs/useEpochBlockchain";

interface Props {
  data: any[];
  rates: BasicRate[];
}

const EpochBlockchainGraph = ({ data }: Props) => {
  const { option, setGraphsVisibility } = useEpochBlockchain({ data });

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 320 }}
        onEvents={{
          legendselectchanged: useMemo(
            () => params => {
              const { selected } = params;
              setGraphsVisibility(selected);
              localStorage.setItem(
                "epoch_blockchain_store",
                JSON.stringify(selected),
              );
            },
            [],
          ),
        }}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='h-full w-full'
      />
    </div>
  );
};

export default EpochBlockchainGraph;
