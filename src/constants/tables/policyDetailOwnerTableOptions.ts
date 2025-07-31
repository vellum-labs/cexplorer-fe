import type { PolicyDetailOwnerTableOptions } from "@/types/tableTypes";

interface PolicyDetailOwnerOptions {
  key: keyof PolicyDetailOwnerTableOptions["columnsVisibility"];
  name: string;
}

export const policyDetailOwnerOptions: PolicyDetailOwnerOptions[] = [
  {
    key: "order",
    name: "#",
  },
  {
    key: "address",
    name: "Address",
  },
  {
    key: "quantity",
    name: "Quantity",
  },
  {
    key: "share",
    name: "Share",
  },
];
