import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const formatEnergy = (
  kWh: number,
): { value: string; unit: string } => {
  if (kWh >= 1_000_000) {
    return { value: `${formatNumber(Math.round(kWh / 1_000_000 * 100) / 100)} GWh`, unit: "GWh" };
  }
  if (kWh >= 1_000) {
    return { value: `${formatNumber(Math.round(kWh / 1_000 * 100) / 100)} MWh`, unit: "MWh" };
  }
  return { value: `${formatNumber(Math.round(kWh * 100) / 100)} kWh`, unit: "kWh" };
};

export const formatCO2 = (
  kg: number,
): { value: string; unit: string } => {
  if (kg >= 1_000) {
    return { value: `${formatNumber(Math.round(kg / 1_000 * 100) / 100)} t`, unit: "t" };
  }
  return { value: `${formatNumber(Math.round(kg * 100) / 100)} kg`, unit: "kg" };
};
