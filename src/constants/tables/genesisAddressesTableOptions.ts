import type {
  BasicTableOptions,
  GenesisAddressesTableColumns,
} from "@/types/tableTypes";

interface GenesisAddressesOptions {
  key: keyof BasicTableOptions<GenesisAddressesTableColumns>["columnsVisibility"];
  name: string;
}

export const genesisAddressesTableOptions: GenesisAddressesOptions[] = [
  {
    key: "order",
    name: "#",
  },
  {
    key: "address",
    name: "Address",
  },
  {
    key: "value",
    name: "Initial Value",
  },
  {
    key: "balance",
    name: "Current Balance",
  },
  {
    key: "first_activity",
    name: "First Activity",
  },
  {
    key: "last_activity",
    name: "Last Activity",
  },
];
