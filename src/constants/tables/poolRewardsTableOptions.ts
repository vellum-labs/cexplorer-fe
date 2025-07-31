import type { BasicTableOptions, PoolRewardsColumns } from "@/types/tableTypes";

type PoolRewardsOptions = {
  key: keyof BasicTableOptions<PoolRewardsColumns>["columnsVisibility"];
  name: string;
}[];

export const poolRewardsTableOptions: PoolRewardsOptions = [
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "rewards",
    name: "Rewards",
  },
  {
    key: "active_stake",
    name: "Active Stake",
  },
  {
    key: "epoch_stake",
    name: "Epoch Stake",
  },
  {
    key: "roa",
    name: "ROA",
  },
  {
    key: "luck",
    name: "Luck",
  },
  {
    key: "blocks",
    name: "Blocks",
  },
  {
    key: "delegators",
    name: "Delegators",
  },
];
