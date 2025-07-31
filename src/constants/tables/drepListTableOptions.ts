import type { DrepListTableOptions } from "@/types/tableTypes";

interface DrepListOptions {
  key: keyof DrepListTableOptions["columnsVisibility"];
  name: string;
}

export const drepListTableOptions: DrepListOptions[] = [
  {
    key: "status",
    name: "Status",
  },
  {
    key: "drep_name",
    name: "DRep Name",
  },
  {
    key: "voting_power",
    name: "Voting Power",
  },
  {
    key: "voting_activity",
    name: "Voting Activity",
  },
  {
    key: "owner_stake",
    name: "Owner Stake",
  },
  {
    key: "average_stake",
    name: "Average Stake",
  },
  {
    key: "registered",
    name: "Registered",
  },
  {
    key: "delegators",
    name: "Delegators",
  },
  {
    key: "metadata",
    name: "DRep metadata",
  },
  {
    key: "spo",
    name: "SPO",
  },
  {
    key: "top_delegator",
    name: "Top delegator",
  },
];
