import { formatEnergy, formatCO2 } from "@/utils/ecoImpact/formatting";

describe("formatEnergy - unit selection", () => {
  it("uses kWh/year for values below 1 000 kWh", () => {
    expect(formatEnergy(0).unit).toBe("kWh/year");
    expect(formatEnergy(1).unit).toBe("kWh/year");
    expect(formatEnergy(999).unit).toBe("kWh/year");
    expect(formatEnergy(999.99).unit).toBe("kWh/year");
  });

  it("uses MWh/year for values between 1 000 and 999 999 kWh", () => {
    expect(formatEnergy(1_000).unit).toBe("MWh/year");
    expect(formatEnergy(50_000).unit).toBe("MWh/year");
    expect(formatEnergy(999_999).unit).toBe("MWh/year");
  });

  it("uses GWh/year for values >= 1 000 000 kWh", () => {
    expect(formatEnergy(1_000_000).unit).toBe("GWh/year");
    expect(formatEnergy(185_000_000_000).unit).toBe("GWh/year");
  });
});

describe("formatEnergy - value conversion", () => {
  it("returns kWh value rounded to 2 decimal places", () => {
    expect(formatEnergy(123.456).value).toBe(123.46);
    expect(formatEnergy(0.999).value).toBe(1);
  });

  it("converts to MWh by dividing by 1 000", () => {
    expect(formatEnergy(1_000).value).toBe(1);
    expect(formatEnergy(1_500).value).toBe(1.5);
    expect(formatEnergy(73_997).value).toBe(74); 
  });

  it("converts to GWh by dividing by 1 000 000", () => {
    expect(formatEnergy(1_000_000).value).toBe(1);
    expect(formatEnergy(185_000_000_000).value).toBe(185_000); 
  });
});

describe("formatCO2 - unit selection", () => {
  it("uses kg/year for values below 1 000 kg", () => {
    expect(formatCO2(0).unit).toBe("kg/year");
    expect(formatCO2(1).unit).toBe("kg/year");
    expect(formatCO2(999).unit).toBe("kg/year");
    expect(formatCO2(999.99).unit).toBe("kg/year");
  });

  it("uses t/year (tonnes) for values >= 1 000 kg", () => {
    expect(formatCO2(1_000).unit).toBe("t/year");
    expect(formatCO2(50_000).unit).toBe("t/year");
  });
});

describe("formatCO2 - value conversion", () => {
  it("returns kg value rounded to 2 decimal places", () => {
    expect(formatCO2(123.456).value).toBe(123.46);
    expect(formatCO2(0.999).value).toBe(1);
  });

  it("converts to tonnes by dividing by 1 000", () => {
    expect(formatCO2(1_000).value).toBe(1);
    expect(formatCO2(2_500).value).toBe(2.5);
    expect(formatCO2(1_234).value).toBe(1.23);
  });
});
