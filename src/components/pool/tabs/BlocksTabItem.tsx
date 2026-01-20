import type { FC } from "react";

import MintedBlocksGraph from "../graphs/MintedBlocksGraph";
import PoolBlocksTable from "../PoolBlocksTable";
import ExpectedBlocksGraph from "../graphs/ExpectedBlocksGraph";

import { usePoolBlocksGraphs } from "@/hooks/pool/usePoolBlocksGraphs";
import { getRouteApi } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface BlocksTabItemProps {
  blocksInEpoch: number;
  estimatedBlocks: number;
}

const BlocksTabItem: FC<BlocksTabItemProps> = ({
  blocksInEpoch,
  estimatedBlocks,
}) => {
  const { t } = useAppTranslation("pages");
  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();

  const { blockCounts, dates, mintedBlocks, probabilities, txCount } =
    usePoolBlocksGraphs(estimatedBlocks, id);

  return (
    <div>
      <h2 className='mb-1'>{t("pools.detailPage.tabs.blocks")}</h2>
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
      <div className='flex flex-col items-end gap-2'>
        <PoolBlocksTable poolId={id} />
      </div>
    </div>
  );
};

export default BlocksTabItem;
