import type {
  DrepRegistrationsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";

type Options = {
  key: keyof TableOptionsCore<DrepRegistrationsColumns>["columnsVisibility"];
  name: string;
}[];

export const drepRegistrationsTableOptions: Options = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "view",
    name: "View",
  },
  {
    key: "type",
    name: "Type",
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
