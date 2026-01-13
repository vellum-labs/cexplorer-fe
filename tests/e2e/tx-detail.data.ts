export const DEFAULT_TX_HASH = "76c32a458c65bfc146df8e8dbe0332480ef2930769b3348e78077d75d7269ea0";

export const txHashToTest = process.env.TX_HASH || DEFAULT_TX_HASH;

export const mandatoryTabs = ["Content", "Overview"] as const;

export const optionalTabs = [
  "Scripts",
  "Contracts",
  "Collateral",
  "Metadata",
  "Mint",
  "Withdrawals",
  "Inputs",
  "Delegations",
  "Governance",
  "Trading",
  "View",
] as const;

export const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
} as const;

export const forbiddenPatterns = [
  "NaN",
  "undefined",
  "Infinity",
  "null",
  "[object Object]",
] as const;
