import type {
  BasicTableOptions,
  GovernanceActionDetailAboutListColumns,
} from "@/types/tableTypes";

interface GovernanceActionDetailAboutTable {
  key: keyof BasicTableOptions<GovernanceActionDetailAboutListColumns>["columnsVisibility"];
  name: string;
}

export const governanceActionDetailAboutTableOptions: GovernanceActionDetailAboutTable[] =
  [
    {
      key: "date",
      name: "Date",
    },
    {
      key: "voter",
      name: "Voter",
    },
    {
      key: "voter_role",
      name: "Voter role",
    },
    {
      key: "voting_power",
      name: "Voting power",
    },
    {
      key: "vote",
      name: "Vote",
    },
    {
      key: "epoch",
      name: "Epoch",
    },
    {
      key: "block",
      name: "block",
    },
    {
      key: "tx",
      name: "tx",
    },
  ];

export const governanceActionDetailDrepSposTableOptions: GovernanceActionDetailAboutTable[] =
  [
    {
      key: "voter",
      name: "Voter",
    },
    {
      key: "voting_power",
      name: "Voting power",
    },
    {
      key: "delegators",
      name: "Delegators",
    },
  ];
