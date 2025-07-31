import type { PoolBirthdaysTableOptions } from "@/types/tableTypes";

interface PoolBirthdaysOptions {
  key: keyof PoolBirthdaysTableOptions["columnsVisibility"];
  name: string;
}

export const poolBirthdaysTableOptions: PoolBirthdaysOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "pool",
    name: "Pool",
  },
  {
    key: "birthday",
    name: "Birthday",
  },
  {
    key: "registered",
    name: "Registered",
  },
  {
    key: "active_stake",
    name: "Active stake",
  },
];
