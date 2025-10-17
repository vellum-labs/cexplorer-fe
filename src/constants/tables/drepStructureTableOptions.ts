import type {
  BasicTableOptions,
  DrepStructureColumns,
} from "@/types/tableTypes";

interface DrepStructureOptions {
  key: keyof BasicTableOptions<DrepStructureColumns>["columnsVisibility"];
  name: string;
}

export const drepStructureTableOptions: DrepStructureOptions[] = [
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
