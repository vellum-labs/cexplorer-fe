export const getHandleStandard = (hex: string): string => {
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
