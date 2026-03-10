import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const formatEnergy = (
  kWh: number,
): { value: string; unit: string } => {
  if (kWh >= 1_000_000) {
    return { value: formatNumber(Math.round(kWh / 1_000_000 * 100) / 100), unit: "GWh/year" };
  }
  if (kWh >= 1_000) {
    return { value: formatNumber(Math.round(kWh / 1_000 * 100) / 100), unit: "MWh/year" };
  }
  return { value: formatNumber(Math.round(kWh * 100) / 100), unit: "kWh/year" };
};

export const formatCO2 = (
  kg: number,
): { value: string; unit: string } => {
  if (kg >= 1_000) {
    return { value: formatNumber(Math.round(kg / 1_000 * 100) / 100), unit: "t/year" };
  }
  return { value: formatNumber(Math.round(kg * 100) / 100), unit: "kg/year" };
};
