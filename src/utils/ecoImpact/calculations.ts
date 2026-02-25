import {
  CONSUMPTION_PER_DEVICE,
  BITCOIN_ANNUAL_ENERGY_GWH,
  CO2_PER_KWH,
  CO2_PER_TREE_YEAR,
  CONVERSION_FACTOR,
} from "@/constants/ecoImpact";

export function calcCardanoAnnualEnergyGWh(countPoolRelayUniq: number): number {
  const estimatedUniqueDevices = countPoolRelayUniq * 1.5;
  return (CONSUMPTION_PER_DEVICE * 365 * 24 * estimatedUniqueDevices) / CONVERSION_FACTOR;
}

export function calcStakePercent(stakedAda: number, totalNetworkActiveStake: number): number {
  return stakedAda / totalNetworkActiveStake;
}

export function calcUserCardanoEnergyKWh(stakePercent: number, cardanoAnnualEnergyGWh: number): number {
  return stakePercent * cardanoAnnualEnergyGWh * 1_000_000;
}

export function calcEnergyEfficiency(cardanoAnnualEnergyGWh: number): number {
  return BITCOIN_ANNUAL_ENERGY_GWH / cardanoAnnualEnergyGWh;
}

export function calcEnergySaved(userCardanoEnergyKWh: number, energyEfficiency: number): number {
  const equivalentBitcoinEnergy = userCardanoEnergyKWh * energyEfficiency;
  return equivalentBitcoinEnergy - userCardanoEnergyKWh;
}

export function calcCO2Saved(energySaved: number): number {
  return energySaved * CO2_PER_KWH;
}

export function calcTrees(co2Saved: number): number {
  return co2Saved / CO2_PER_TREE_YEAR;
}
