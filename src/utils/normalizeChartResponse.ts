import type { OHLCPoint } from "@/types/ohlc";

export const normalizeChartResponse = (raw: any): OHLCPoint[] => {
  if (!raw) return [];

  if (!raw.data && typeof raw.open === "number") {
    return [raw];
  }

  if (Array.isArray(raw.data)) {
    return raw.data;
  }

  return [];
};
