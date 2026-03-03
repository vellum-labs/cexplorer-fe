import type { MilestonePaymentsColumns } from "@/types/tableTypes";

export const milestonePaymentsTableOptions: {
  key: keyof MilestonePaymentsColumns;
}[] = [
  { key: "milestone" },
  { key: "amount" },
  { key: "transaction" },
  { key: "date" },
  { key: "event" },
];
