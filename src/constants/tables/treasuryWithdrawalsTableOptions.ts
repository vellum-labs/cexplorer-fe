import type {
  BasicTableOptions,
  TreasuryWithdrawalsTableColumns,
} from "@/types/tableTypes";

interface TreasuryWithdrawalsTableOptions {
  key: keyof BasicTableOptions<TreasuryWithdrawalsTableColumns>["columnsVisibility"];
  name: string;
}

export const treasuryWithdrawalsTableOptions: TreasuryWithdrawalsTableOptions[] =
  [
    {
      key: "start",
      name: "Start",
    },
    {
      key: "type",
      name: "Type",
    },
    {
      key: "gov_action_name",
      name: "Governance action name",
    },
    {
      key: "amount",
      name: "Amount",
    },
    {
      key: "status",
      name: "Status",
    },
    {
      key: "progress",
      name: "Progress",
    },
    {
      key: "tx",
      name: "Tx",
    },
  ];
