export const getAnimalRangeByAmount = (amount: number): string => {
  switch (true) {
    case amount <= 10000000:
      return "₳ 0 - ₳ 10";
    case amount <= 1000000000:
      return "₳ 10 - ₳ 1K";
    case amount <= 5000000000:
      return "₳ 1K - ₳ 5K";
    case amount <= 25000000000:
      return "₳ 5K - ₳ 25K";
    case amount <= 100000000000:
      return "₳ 25K - ₳ 100K";
    case amount <= 250000000000:
      return "₳ 100K - ₳ 250K";
    case amount <= 1000000000000:
      return "₳ 250K - ₳ 1M";
    case amount <= 5000000000000:
      return "₳ 1M - ₳ 5M";
    case amount <= 20000000000000:
      return "₳ 5M - ₳ 20M";
    default:
      return "";
  }
};
