export const TREASURY_WALLETS = [
  {
    name: "Operations, hot wallet",
    address:
      "addr1q9sz5kw40pmnkcmmfvssm5fy2vzkk7l0wu5szv25nnffkqnkc35qyrgnqu8tl96u5eejytgvtsqatr2ms6hrxhdzq4pslvp2rm",
  },
  {
    name: "Company treasury wallet",
    address:
      "addr1q9f9zr2ts4pzx0v3m9e2tkl6uyefrlhz39cdm3257a935efcupfwzfyl6n8szftvejs46h6697f2uvmfslq47m6vz9psek28vr",
  },
];

export const TAU_NODE_ID = "Treasury via τ (2025)";
export const BUDGET_NODE_ID = "Budget Expenditures (2025)";
export const REWARDS_POT_NODE_ID = "Rewards pot (2025)";
export const STAKING_REWARDS_NODE_ID = "Staking rewards (2025)";
export const TREASURY_NODE_ID = "Treasury (2025)";
export const SPENT_NODE_ID = "Spent (Withdrawn) (2025)";
export const ALLOCATED_NODE_ID = "Allocated (Active/Matured/Paused) (2025)";

export const INCOME_NODES = new Set([
  "Reserve emissions (2025)",
  "Fee revenue (2025)",
  "Treasury donations (2025)",
]);

export const COLORS = {
  income: "#16a34a",
  neutral: "#9ca3af",
  expenditure: "#ef4444",
  loan: "#3b82f6",
};

export const HIDE_NODE_LABELS = new Set([
  REWARDS_POT_NODE_ID,
  STAKING_REWARDS_NODE_ID,
  TREASURY_NODE_ID,
]);

export const LABEL_OVERRIDES: Record<string, string> = {
  [TREASURY_NODE_ID]: "Treasury Flows",
  [SPENT_NODE_ID]: "Budget Spent",
  [ALLOCATED_NODE_ID]: "Budget Allocations",
  ["Loans (2025)"]: "Budget Loans",
};
