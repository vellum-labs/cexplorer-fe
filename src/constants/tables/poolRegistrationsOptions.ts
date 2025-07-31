import type {
  PoolRegistrationsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";

type Options = {
  key: keyof TableOptionsCore<PoolRegistrationsColumns>["columnsVisibility"];
  name: string;
}[];

export const poolRegistrationsTableOptions: Options = [
  {
    key: "date",
    name: "Date",
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
