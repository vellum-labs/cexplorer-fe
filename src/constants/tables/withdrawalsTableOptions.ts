import type { BasicTableOptions, WithdrawalsColumns } from "@/types/tableTypes";

type WithdrawalsTableOptions = {
  key: keyof BasicTableOptions<WithdrawalsColumns>["columnsVisibility"];
  name: string;
}[];

export const withdrawalsTableOptions: WithdrawalsTableOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "address",
    name: "Address",
  },
  {
    key: "amount_controlled",
    name: "Amount",
  },
  {
    key: "amount_withdrawn",
    name: "Amount Withdrawn",
  },
  {
    key: "delegated_to",
    name: "Delegated to",
  },
  {
    key: "tx",
    name: "Tx",
  },
];
