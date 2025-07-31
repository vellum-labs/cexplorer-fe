import type {
  ContractInteractionsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";

type Options = {
  key: keyof TableOptionsCore<ContractInteractionsColumns>["columnsVisibility"];
  name: string;
}[];

export const contractInteractionsTableOptions: Options = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "purpose",
    name: "Purpose",
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
    key: "unit_steps",
    name: "Unit Steps",
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
