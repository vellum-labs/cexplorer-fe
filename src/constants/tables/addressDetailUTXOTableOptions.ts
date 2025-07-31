import type {
  AddressDetailUTXOColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

interface AddressDetailUTXOOptions {
  key: keyof BasicTableOptions<AddressDetailUTXOColumns>["columnsVisibility"];
  name: string;
}

export const addressDetailUTXOOptions: AddressDetailUTXOOptions[] = [
  {
    key: "hash",
    name: "Hash",
  },
  {
    key: "index",
    name: "Index",
  },
  {
    key: "amount",
    name: "Amount",
  },
  {
    key: "min_utxo",
    name: "Min UTXO ADA",
  },
];
