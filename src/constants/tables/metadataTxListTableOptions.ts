import type {
  BasicTableOptions,
  MetadataTxListTableColumns,
} from "@/types/tableTypes";

interface MetadataTxOptions {
  key: keyof BasicTableOptions<MetadataTxListTableColumns>["columnsVisibility"];
  name: string;
}

export const metadataTxListTableOptions: MetadataTxOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "key",
    name: "Key",
  },
  {
    key: "hash",
    name: "Hash",
  },
  {
    key: "size",
    name: "Size",
  },
  {
    key: "md",
    name: "Metadata",
  },
];
