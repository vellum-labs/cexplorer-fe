import type {
  BasicTableOptions,
  PoolStructureColumns,
} from "@/types/tableTypes";

interface PoolStructureOptions {
  key: keyof BasicTableOptions<PoolStructureColumns>["columnsVisibility"];
  name: string;
}

export const poolStructureTableOptions: PoolStructureOptions[] = [
  {
    key: "wallet_size",
    name: "Wallet Size",
  },
  {
    key: "amount",
    name: "Count",
  },
  {
    key: "amount_pie",
    name: "Count %",
  },
  {
    key: "holdings",
    name: "Stake",
  },
  {
    key: "holdings_pie",
    name: "Stake %",
  },
];
