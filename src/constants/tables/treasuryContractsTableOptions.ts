import type { TreasuryContractsColumns } from "@/types/tableTypes";

export const treasuryContractsTableOptions: {
  key: keyof TreasuryContractsColumns;
}[] = [
  { key: "project" },
  { key: "vendor" },
  { key: "budget" },
  { key: "milestones" },
  { key: "status" },
];
