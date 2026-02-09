import type { SankeyLink } from "@/types/treasuryTypes";

import {
  COLORS,
  INCOME_NODES,
  LABEL_OVERRIDES,
  REWARDS_POT_NODE_ID,
  STAKING_REWARDS_NODE_ID,
  TREASURY_NODE_ID,
} from "@/constants/treasury";

export const isIncomeNode = (name: string) => INCOME_NODES.has(name);

export const isExpenditureNode = (name: string) =>
  name.includes("Budget Expenditures") ||
  name.includes("Staking rewards") ||
  name.includes("Spent (Withdrawn)") ||
  name.includes("Allocated (Active/Matured/Paused)") ||
  name.includes("(Withdrawn 2025)") ||
  name.includes("(Allocated 2025)");

export const isLoanNode = (name: string) =>
  name.includes("Loans (2025)") || name.includes("(Loan 2025)");

export const isDonationLink = (link: SankeyLink) =>
  link.source === "Treasury donations (2025)" &&
  link.target === "Treasury (2025)";

export const isRewardsToStakingLink = (link: SankeyLink) =>
  link.source === REWARDS_POT_NODE_ID &&
  link.target === STAKING_REWARDS_NODE_ID;

export const isRewardsToTreasuryLink = (link: SankeyLink) =>
  link.source === REWARDS_POT_NODE_ID && link.target === TREASURY_NODE_ID;

export const stripYear = (label: string) =>
  label
    .replace(/\s*2025(?=\))/g, "")
    .replace(/\s*\(2025\)/g, "")
    .replace(/\s*\((Withdrawn|Allocated|Loan)\)/g, "")
    .replace(/\s*\(\s*\)/g, "")
    .replace(/\s+\)/g, ")")
    .replace(/\s{2,}/g, " ")
    .trim();

export const getDisplayName = (label: string) =>
  LABEL_OVERRIDES[label] ?? stripYear(label);

export const getNodeColor = (name: string) => {
  if (isLoanNode(name)) {
    return COLORS.loan;
  }
  if (isExpenditureNode(name)) {
    return COLORS.expenditure;
  }
  if (isIncomeNode(name)) {
    return COLORS.income;
  }
  return COLORS.neutral;
};

export const getLinkColor = (source: string, target: string) => {
  if (isLoanNode(target) || isLoanNode(source)) {
    return COLORS.loan;
  }
  if (isExpenditureNode(target) || isExpenditureNode(source)) {
    return COLORS.expenditure;
  }
  if (isIncomeNode(source)) {
    return COLORS.income;
  }
  return COLORS.neutral;
};

export const formatAda = (value: number) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} ADA`;

export const formatPercent = (value: number) => {
  if (value > 0 && value < 0.1) {
    return "<0.1%";
  }
  return `${value.toFixed(1)}%`;
};
