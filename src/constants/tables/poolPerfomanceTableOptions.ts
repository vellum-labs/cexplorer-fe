import type {
  BasicTableOptions,
  PoolPefomanceColumns,
} from "@/types/tableTypes";

type PoolPerfomanceOptions = {
  key: keyof BasicTableOptions<PoolPefomanceColumns>["columnsVisibility"];
  name: string;
}[];

export const poolPerfomanceTableOptions: PoolPerfomanceOptions = [
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "date_start",
    name: "Start time",
  },
  {
    key: "date_end",
    name: "End time",
  },
  {
    key: "active_stake",
    name: "Active stake",
  },
  {
    key: "blocks",
    name: "Blocks",
  },
  {
    key: "delegators",
    name: "Delegators",
  },
  {
    key: "luck",
    name: "Luck",
  },
  {
    key: "pledged",
    name: "Pledged",
  },
  {
    key: "roa",
    name: "Roa",
  },
];
