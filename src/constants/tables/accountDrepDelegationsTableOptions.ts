import type {
  BasicTableOptions,
  DrepDelegationsColumns,
} from "@/types/tableTypes";

type AccountDrepDelegationsTableOptions = {
  key: keyof BasicTableOptions<DrepDelegationsColumns>["columnsVisibility"];
  name: string;
}[];

export const accountDrepDelegationsTableOptions: AccountDrepDelegationsTableOptions =
  [
    {
      key: "date",
      name: "Date",
    },
    {
      key: "drep",
      name: "DRep",
    },
    {
      key: "active_stake",
      name: "Active Stake",
    },
    {
      key: "live_stake",
      name: "Live Stake",
    },
    {
      key: "loyalty",
      name: "Loyalty",
    },
    {
      key: "tx",
      name: "Tx",
    },
  ];
