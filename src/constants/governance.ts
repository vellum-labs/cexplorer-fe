// Governance Action Types - following the pattern from votes.ts
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

// Voter Role Types
export const voterRoles = {
  constitutionalCommittee: "ConstitutionalCommittee",
  drep: "DRep",
  spo: "SPO",
} as const;

export type VoterRole = (typeof voterRoles)[keyof typeof voterRoles];

// Helper arrays for voting eligibility
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

// Constitutional Committee voting actions (they vote on most actions except those that affect them directly)
export const ccVotingActions = [
  "NewConstitution",
  "HardForkInitiation",
  "ParameterChange",
  "TreasuryWithdrawals",
  "InfoAction",
] as const;