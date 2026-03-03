export const nameToHex = (name: string): string =>
  Array.from(new TextEncoder().encode(name))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

export const getHandleStandard = (hex: string): string => {
  if (!hex || hex.length < 8) {
    return "CIP-25";
  }

  const prefix = hex.slice(0, 8);

  switch (prefix) {
    case "000de140":
      return "CIP-68 (222)";
    case "0014df10":
      return "CIP-68 (001)";
    case "000643b0":
      return "CIP-68 (100)";
    default:
      return "CIP-25";
  }
};
