import type { PoolBlockTableOptions } from "@/types/tableTypes";

interface PoolIssuesMissedBlocks {
  key: keyof PoolBlockTableOptions["columnsVisibility"];
  name: string;
}

export const poolIssuesMissedBlocksTableOptions: PoolIssuesMissedBlocks[] = [
  {
    key: "pool",
    name: "Pool",
  },
  {
    key: "luck",
    name: "Luck",
  },
  {
    key: "minted_blocks",
    name: "Minted blocks",
  },
  {
    key: "estimated_blocks",
    name: "Estimated blocks",
  },
];
