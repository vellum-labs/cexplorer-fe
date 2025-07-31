import type { PoolsListResponseDataItem } from "@/types/poolTypes";

export const calculateTotalPoolBlocks = (
  poolData: PoolsListResponseDataItem,
): {
  totalMintedBlocks: number;
  totalEstimatedBlocks: number;
} => {
  const epochs = poolData.epochs;
  let totalMintedBlocks = 0;
  let totalEstimatedBlocks = 0;

  for (const epochId in epochs) {
    const epochData = epochs[epochId]?.data;

    if (epochData) {
      totalMintedBlocks += epochData.block.minted;
      totalEstimatedBlocks += epochData.block.estimated;
    }
  }

  return {
    totalMintedBlocks,
    totalEstimatedBlocks,
  };
};
