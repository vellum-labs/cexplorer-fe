export const getAnimalRangeByName = (name: string): string => {
  switch (name) {
    case "plankton":
      return "₳ 0 - ₳ 10";
    case "shrimp":
      return "₳ 10 - ₳ 1K";
    case "crab":
      return "₳ 1K - ₳ 5K";
    case "fish":
      return "₳ 5K - ₳ 25K";
    case "dolphin":
      return "₳ 25K - ₳ 100K";
    case "shark":
      return "₳ 100K - ₳ 250K";
    case "whale":
      return "₳ 250K - ₳ 1M";
    case "tuna":
      return "₳ 1M - ₳ 5M";
    case "humpback":
      return "₳ 5M - ₳ 20M";
    case "leviathan":
      return "₳ 20M+";
    default:
      return "";
  }
};
