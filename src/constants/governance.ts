export const governanceActionTypes = [
  "NoConfidence",
  "NewCommittee",
  "NewConstitution",
  "HardForkInitiation",
  "ParameterChange",
  "TreasuryWithdrawals",
  "InfoAction",
] as const;

export type GovernanceActionType = (typeof governanceActionTypes)[number];

export const voterRoles = {
  constitutionalCommittee: "ConstitutionalCommittee",
  drep: "DRep",
  spo: "SPO",
} as const;

export type VoterRole = (typeof voterRoles)[keyof typeof voterRoles];

export const drepVotingActions = [
  "NoConfidence",
  "NewCommittee",
  "NewConstitution",
  "HardForkInitiation",
  "ParameterChange",
  "TreasuryWithdrawals",
  "InfoAction",
] as const;

export const spoVotingActions = [
  "NoConfidence",
  "NewCommittee",
  "HardForkInitiation",
  "InfoAction",
] as const;

export const ccVotingActions = [
  "NewConstitution",
  "HardForkInitiation",
  "ParameterChange",
  "TreasuryWithdrawals",
  "InfoAction",
] as const;

export type GovStatus =
  | "ACTIVE"
  | "ENACTED"
  | "RATIFIED"
  | "DROPPED"
  | "EXPIRED";

export const govStatusColors: Record<GovStatus, string> = {
  ACTIVE: "#10B981",
  ENACTED: "#10B981",
  RATIFIED: "#3B82F6",
  DROPPED: "#F59E0B",
  EXPIRED: "#F59E0B",
};

export const govStatusBgColors: Record<GovStatus, string> = {
  ACTIVE: "#D1FAE5",
  ENACTED: "#D1FAE5",
  RATIFIED: "#DBEAFE",
  DROPPED: "#FEF3C7",
  EXPIRED: "#FEF3C7",
};

export const govTypeLabels: Record<string, string> = {
  NewCommittee: "New Committee",
  NewConstitution: "New Constitution",
  HardForkInitiation: "Hardfork Initiation",
  ParameterChange: "Parameter Change",
  TreasuryWithdrawals: "Treasury Withdrawals",
  InfoAction: "Info Action",
  NoConfidence: "No Confidence",
};
