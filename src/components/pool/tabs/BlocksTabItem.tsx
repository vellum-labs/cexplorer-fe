import type { FC } from "react";

import MintedBlocksGraph from "../graphs/MintedBlocksGraph";
import PoolBlocksTable from "../PoolBlocksTable";
import ExpectedBlocksGraph from "../graphs/ExpectedBlocksGraph";

import { usePoolBlocksGraphs } from "@/hooks/pool/usePoolBlocksGraphs";
import { getRouteApi } from "@tanstack/react-router";

interface BlocksTabItemProps {
  blocksInEpoch: number;
  estimatedBlocks: number;
}

const BlocksTabItem: FC<BlocksTabItemProps> = ({
  blocksInEpoch,
  estimatedBlocks,
}) => {
  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();

  const { blockCounts, dates, mintedBlocks, probabilities, txCount } =
    usePoolBlocksGraphs(estimatedBlocks, id);

  return (
    <div>
      <h2 className='mb-1'>Blocks</h2>
      <MintedBlocksGraph
        mintedBlocks={mintedBlocks}
        dates={dates}
        txCount={txCount}
      />
      <ExpectedBlocksGraph
        blocksInEpoch={blocksInEpoch}
        blockCounts={blockCounts}
        probabilities={probabilities}
      />
      <div className='flex flex-col items-end gap-4'>
        <PoolBlocksTable poolId={id} />
      </div>
    </div>
  );
};

export default BlocksTabItem;
