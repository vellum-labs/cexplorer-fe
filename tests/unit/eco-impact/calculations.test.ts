import {
  calcCardanoAnnualEnergyGWh,
  calcStakePercent,
  calcUserCardanoEnergyKWh,
  calcEnergyEfficiency,
  calcEnergySaved,
  calcCO2Saved,
  calcTrees,
} from "@/utils/ecoImpact/calculations";
import {
  CONSUMPTION_PER_DEVICE,
  BITCOIN_ANNUAL_ENERGY_GWH,
  CO2_PER_KWH,
  CO2_PER_TREE_YEAR,
  CONVERSION_FACTOR,
} from "@/constants/ecoImpact";

describe("calcCardanoAnnualEnergyGWh", () => {
  it("multiplies unique devices by 1.5 and applies energy formula", () => {
    const relays = 1000;
    const expectedDevices = 1500;
    const expected = (CONSUMPTION_PER_DEVICE * 365 * 24 * expectedDevices) / CONVERSION_FACTOR;
    expect(calcCardanoAnnualEnergyGWh(relays)).toBeCloseTo(expected, 10);
  });

  it("returns 0 when no relays", () => {
    expect(calcCardanoAnnualEnergyGWh(0)).toBe(0);
  });

  it("scales linearly with relay count", () => {
    const single = calcCardanoAnnualEnergyGWh(1000);
    const double = calcCardanoAnnualEnergyGWh(2000);
    expect(double).toBeCloseTo(single * 2, 10);
  });
});

describe("calcStakePercent", () => {
  it("returns correct fraction of total stake", () => {
    expect(calcStakePercent(1_000, 10_000)).toBeCloseTo(0.1, 10);
  });

  it("returns 1 when user holds 100% of stake", () => {
    expect(calcStakePercent(5_000, 5_000)).toBe(1);
  });

  it("returns a very small number for a tiny stake", () => {
    expect(calcStakePercent(1, 25_000_000_000)).toBeCloseTo(4e-11, 20);
  });
});

describe("calcUserCardanoEnergyKWh", () => {
  it("returns user share of total Cardano energy in kWh", () => {
    const cardanoGWh = calcCardanoAnnualEnergyGWh(3000);
    const stakePercent = 0.1;
    const result = calcUserCardanoEnergyKWh(stakePercent, cardanoGWh);
    expect(result).toBeCloseTo(cardanoGWh * 1_000_000 * 0.1, 5);
  });

  it("returns 0 for zero stake percent", () => {
    expect(calcUserCardanoEnergyKWh(0, 100)).toBe(0);
  });
});

describe("calcEnergyEfficiency", () => {
  it("is Bitcoin annual energy divided by Cardano annual energy", () => {
    const cardanoGWh = 10;
    expect(calcEnergyEfficiency(cardanoGWh)).toBeCloseTo(BITCOIN_ANNUAL_ENERGY_GWH / 10, 5);
  });

  it("Bitcoin is much more energy intensive than Cardano", () => {
    const cardanoGWh = calcCardanoAnnualEnergyGWh(3000);
    const efficiency = calcEnergyEfficiency(cardanoGWh);
    expect(efficiency).toBeGreaterThan(1000);
  });
});

describe("calcEnergySaved", () => {
  it("equals equivalent Bitcoin energy minus user Cardano energy", () => {
    const userCardanoKWh = 100;
    const efficiency = 50_000;
    const equivalentBitcoin = userCardanoKWh * efficiency;
    const expected = equivalentBitcoin - userCardanoKWh;
    expect(calcEnergySaved(userCardanoKWh, efficiency)).toBeCloseTo(expected, 5);
  });

  it("is always positive when efficiency > 1", () => {
    const cardanoGWh = calcCardanoAnnualEnergyGWh(3000);
    const efficiency = calcEnergyEfficiency(cardanoGWh);
    const userKWh = calcUserCardanoEnergyKWh(0.001, cardanoGWh);
    expect(calcEnergySaved(userKWh, efficiency)).toBeGreaterThan(0);
  });

  it("returns 0 when user energy is 0", () => {
    expect(calcEnergySaved(0, 100_000)).toBe(0);
  });
});

describe("calcCO2Saved", () => {
  it("multiplies energy saved by CO2_PER_KWH constant", () => {
    const energySaved = 1000;
    expect(calcCO2Saved(energySaved)).toBeCloseTo(1000 * CO2_PER_KWH, 10);
  });

  it("returns 0 for zero energy saved", () => {
    expect(calcCO2Saved(0)).toBe(0);
  });

  it("uses the constant 0.5 kg CO2 per kWh", () => {
    expect(CO2_PER_KWH).toBe(0.5);
    expect(calcCO2Saved(200)).toBe(100);
  });
});

describe("calcTrees", () => {
  it("divides CO2 saved by CO2_PER_TREE_YEAR constant", () => {
    const co2 = 220;
    expect(calcTrees(co2)).toBeCloseTo(220 / CO2_PER_TREE_YEAR, 10);
  });

  it("uses the constant 22 kg CO2 per tree per year", () => {
    expect(CO2_PER_TREE_YEAR).toBe(22);
    expect(calcTrees(22)).toBe(1);
    expect(calcTrees(110)).toBe(5);
  });

  it("returns 0 for zero CO2 saved", () => {
    expect(calcTrees(0)).toBe(0);
  });
});

describe("full calculation pipeline", () => {
  it("produces positive trees value for a realistic stake scenario", () => {
    const countPoolRelayUniq = 3000;
    const stakePercent = 0.0001;

    const cardanoGWh = calcCardanoAnnualEnergyGWh(countPoolRelayUniq);
    const userKWh = calcUserCardanoEnergyKWh(stakePercent, cardanoGWh);
    const efficiency = calcEnergyEfficiency(cardanoGWh);
    const energySaved = calcEnergySaved(userKWh, efficiency);
    const co2Saved = calcCO2Saved(energySaved);
    const trees = calcTrees(co2Saved);

    expect(trees).toBeGreaterThan(0);
  });

  it("larger stake produces more trees saved", () => {
    const countPoolRelayUniq = 3000;
    const cardanoGWh = calcCardanoAnnualEnergyGWh(countPoolRelayUniq);
    const efficiency = calcEnergyEfficiency(cardanoGWh);

    const calcTreesForStake = (percent: number) => {
      const userKWh = calcUserCardanoEnergyKWh(percent, cardanoGWh);
      const energySaved = calcEnergySaved(userKWh, efficiency);
      return calcTrees(calcCO2Saved(energySaved));
    };

    expect(calcTreesForStake(0.01)).toBeGreaterThan(calcTreesForStake(0.001));
  });
});
