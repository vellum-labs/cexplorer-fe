import type {
  BasicTableOptions,
  ScriptDetailUsesColumns,
} from "@/types/tableTypes";

type ScriptDetailUsesTableOptions = {
  key: keyof BasicTableOptions<ScriptDetailUsesColumns>["columnsVisibility"];
  name: string;
}[];

export const scriptDetailUsesTableOptions: ScriptDetailUsesTableOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "hash",
    name: "Hash",
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
    key: "memory",
    name: "Memory",
  },
  {
    key: "steps",
    name: "Steps",
  },
  {
    key: "purpose",
    name: "Purpose",
  },
];
