import type {
  BasicTableOptions,
  ScriptListInteractionsTableColumns,
} from "@/types/tableTypes";

type ScriptListInteractionTableOptions = {
  key: keyof BasicTableOptions<ScriptListInteractionsTableColumns>["columnsVisibility"];
  name: string;
}[];

export const scriptListInteractionTableOptions: ScriptListInteractionTableOptions =
  [
    {
      key: "date",
      name: "Date",
    },
    {
      key: "dapp",
      name: "Hash",
    },
    {
      key: "tx_hash",
      name: "Transaction Hash",
    },
    {
      key: "output",
      name: "Output",
    },
    {
      key: "fee",
      name: "Fee",
    },
    {
      key: "memory_used",
      name: "Memory used",
    },
    {
      key: "cpu_steps",
      name: "CPU steps",
    },
    {
      key: "purpose",
      name: "Purpose",
    },
  ];
