export interface NCLPeriod {
  id: string;
  name: string;
  startEpoch: number;
  endEpoch: number;
  limit: number;
  note?: string;
}

export const NCL_WITHDRAWAL_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#eab308",
  "#06b6d4",
  "#6366f1",
  "#f43f5e",
  "#14b8a6",
  "#a855f7",
];

export const NCL_PERIODS: NCLPeriod[] = [
  {
    id: "ncl-2024-2025",
    name: "NCL 2024-2025",
    startEpoch: 550,
    endEpoch: 632,
    limit: 350_000_000_000_000,
    note: "First NCL period approved by governance",
  },
];

export const getCurrentNCLPeriod = (
  currentEpoch: number,
): NCLPeriod | undefined => {
  return NCL_PERIODS.find(
    p => currentEpoch >= p.startEpoch && currentEpoch <= p.endEpoch,
  );
};

export const getNCLPeriodById = (id: string): NCLPeriod | undefined => {
  return NCL_PERIODS.find(p => p.id === id);
};
