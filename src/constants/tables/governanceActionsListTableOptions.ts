import type {
  BasicTableOptions,
  GovernanceListTableColumns,
} from "@/types/tableTypes";

interface GovernanceActionListTableOptions {
  key: keyof BasicTableOptions<GovernanceListTableColumns>["columnsVisibility"];
  name: string;
}

export const governanceListTableOptions: GovernanceActionListTableOptions[] = [
  {
    key: "start",
    name: "Start",
  },
  {
    key: "type",
    name: "Type",
  },
  {
    key: "gov_action_name",
    name: "Governance action name",
  },
  {
    key: "duration",
    name: "Duration (epochs)",
  },
  {
    key: "end",
    name: "End",
  },
  {
    key: "status",
    name: "Status",
  },
  {
    key: "tx",
    name: "Tx",
  },
];
