export function formatEnergy(kWh: number): { value: number; unit: string } {
  if (kWh >= 1_000_000) {
    return { value: Math.round((kWh / 1_000_000) * 100) / 100, unit: "GWh/year" };
  }
  if (kWh >= 1_000) {
    return { value: Math.round((kWh / 1_000) * 100) / 100, unit: "MWh/year" };
  }
  return { value: Math.round(kWh * 100) / 100, unit: "kWh/year" };
}

export function formatCO2(kg: number): { value: number; unit: string } {
  if (kg >= 1_000) {
    return { value: Math.round((kg / 1_000) * 100) / 100, unit: "t/year" };
  }
  return { value: Math.round(kg * 100) / 100, unit: "kg/year" };
}
