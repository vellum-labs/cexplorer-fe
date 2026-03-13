import type { StablecoinSummaryColumns, TableOptionsCore } from "@/types/tableTypes";

type StablecoinSummaryTableOptions = {
  key: keyof TableOptionsCore<StablecoinSummaryColumns>["columnsVisibility"];
  name: string;
}[];

export const stablecoinSummaryTableOptions: StablecoinSummaryTableOptions = [
  {
    key: "source",
    name: "Source",
  },
  {
    key: "stablecoin",
    name: "Stablecoin",
  },
  {
    key: "supply",
    name: "Supply",
  },
  {
    key: "dominance",
    name: "Dominance",
  },
  {
    key: "last_mint",
    name: "Last mint",
  },
];
