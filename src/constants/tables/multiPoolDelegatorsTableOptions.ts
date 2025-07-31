import type { MultiPoolDelegatorsColumns } from "@/types/tableTypes";

interface MultiPoolDelegatorsOptions {
  key: keyof MultiPoolDelegatorsColumns;
  name: string;
}

export const multiPoolDelegatorsTableOptions: MultiPoolDelegatorsOptions[] = [
  {
    key: "payment_cred",
    name: "Payment Credential",
  },
  {
    key: "stake",
    name: "Stake",
  },
  {
    key: "delegated_to",
    name: "Delegated to",
  },
];
