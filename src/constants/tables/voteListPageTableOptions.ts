import type {
  BasicTableOptions,
  VoteListPageColumns,
} from "@/types/tableTypes";

interface VoteListPageTable {
  key: keyof BasicTableOptions<VoteListPageColumns>["columnsVisibility"];
  name: string;
}

export const voteListPageTableOptions: VoteListPageTable[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "gov_action",
    name: "Action",
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
    name: "Block",
  },
  {
    key: "tx",
    name: "Tx",
  },
];
