import type {
  BasicTableOptions,
  StakeWithdrawalsColumns,
} from "@/types/tableTypes";

interface StakeWithdrawalsTableOptions {
  key: keyof BasicTableOptions<StakeWithdrawalsColumns>["columnsVisibility"];
  name: string;
}

export const stakeWithdrawalTableOptions: StakeWithdrawalsTableOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "tx_hash",
    name: "Transaction Hash",
  },
  {
    key: "block",
    name: "Block",
  },
  {
    key: "total_output",
    name: "Total Output",
  },
  // {
  //   key: "real_output",
  //   name: "Real Output",
  // },
  {
    key: "amount",
    name: "Amount",
  },
  {
    key: "fee",
    name: "Fee",
  },
  {
    key: "size",
    name: "Size",
  },
];
