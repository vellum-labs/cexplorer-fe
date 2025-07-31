import type {
  PoolDeregistrationsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";

type Options = {
  key: keyof TableOptionsCore<PoolDeregistrationsColumns>["columnsVisibility"];
  name: string;
}[];

export const poolDeregistrationsTableOptions: Options = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "longetivity",
    name: "Longetivity",
  },
  {
    key: "view",
    name: "View",
  },
  {
    key: "deposit",
    name: "Deposit",
  },
  {
    key: "fee",
    name: "Fee",
  },
  {
    key: "hash",
    name: "TX Hash",
  },
  {
    key: "epoch_block",
    name: "Epoch/Block",
  },
];
