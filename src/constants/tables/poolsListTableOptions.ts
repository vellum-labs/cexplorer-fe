import type { PoolsListTableOptions } from "@/types/tableTypes";

type PoolsListOptions = {
  key: keyof PoolsListTableOptions["columnsVisibility"];
  name: string;
}[];

export const poolsListTableOptions: PoolsListOptions = [
  {
    key: "ranking",
    name: "#",
  },
  {
    key: "pool",
    name: "Pool",
  },
  {
    key: "stake",
    name: "Stake",
  },
  {
    key: "rewards",
    name: "Rewards",
  },
  {
    key: "luck",
    name: "Luck",
  },
  {
    key: "fees",
    name: "Fees",
  },
  {
    key: "blocks",
    name: "Blocks",
  },
  {
    key: "pledge",
    name: "Pledge",
  },
  {
    key: "avg_stake",
    name: "Average stake",
  },
  {
    key: "delegators",
    name: "Delegators",
  },
  {
    key: "top_delegator",
    name: "Top delegator",
  },
  {
    key: "drep",
    name: "DRep",
  },
  {
    key: "pledge_leverage",
    name: "Pledge Leverage",
  },
];
