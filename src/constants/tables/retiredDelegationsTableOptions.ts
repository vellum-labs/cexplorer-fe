import type {
  BasicTableOptions,
  RetiredDelegationsColumns,
} from "@/types/tableTypes";

type RetiredDelegationsTableOptions = {
  key: keyof BasicTableOptions<RetiredDelegationsColumns>["columnsVisibility"];
  name: string;
}[];

export const retiredDelegationsTableOptions: RetiredDelegationsTableOptions = [
  {
    key: "index",
    name: "#",
  },
  {
    key: "pool",
    name: "Stake Pool",
  },
  {
    key: "epoch",
    name: "Retired in Epoch",
  },
  {
    key: "stake",
    name: "Active Stake",
  },
  {
    key: "delegators",
    name: "Delegators",
  },
  {
    key: "longevity",
    name: "Longevity",
  },
];
