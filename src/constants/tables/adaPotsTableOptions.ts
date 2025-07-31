import type { AdaPotsOptions } from "@/types/tableTypes";

interface AdaPots {
  key: keyof AdaPotsOptions["columnsVisibility"];
  name: string;
}

export const adaPotsTableOptions: AdaPots[] = [
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "treasury",
    name: "Treausry",
  },
  {
    key: "reserves",
    name: "Reserves",
  },
  {
    key: "rewards",
    name: "Rewards",
  },
  {
    key: "utxo",
    name: "UTXO",
  },
  {
    key: "deposits",
    name: "Deposits",
  },
  {
    key: "fees",
    name: "Fees",
  },
];
