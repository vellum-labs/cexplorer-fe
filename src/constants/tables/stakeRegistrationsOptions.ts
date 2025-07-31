import type {
  StakeRegistrationsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";

type Options = {
  key: keyof TableOptionsCore<StakeRegistrationsColumns>["columnsVisibility"];
  name: string;
}[];

export const stakeRegistrationsTableOptions: Options = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "type",
    name: "Type",
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
    key: "hash",
    name: "TX Hash",
  },
  {
    key: "epoch_block",
    name: "Epoch/Block",
  },
];
