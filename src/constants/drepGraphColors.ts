export const DREP_GRAPH_COLORS: string[] = [
  "#FEF08A",
  "#86EFAC",
  "#DBEAFE",
  "#F3E8FF",
  "#FED7D7",
  "#FFF2CC",
  "#E0F2FE",
  "#A7F3D0",
  "#F1C0E8",
  "#C7D2FE",
  "#FDE68A",
  "#D1FAE5",
  "#FEE2E2",
  "#E0E7FF",
  "#FECACA",
  "#BAE6FD",
];

export const DREP_GRAPH_LABEL_COLORS: string[] = [
  "#854D0E",
  "#166534",
  "#1E40AF",
  "#7C3AED",
  "#DC2626",
  "#EA580C",
  "#0891B2",
  "#059669",
  "#BE185D",
  "#4338CA",
  "#D97706",
  "#047857",
  "#BE123C",
  "#5B21B6",
  "#B91C1C",
  "#0369A1",
];

export const formatHashLong = (hash: string | null): string => {
  if (!hash) return "";
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
};
