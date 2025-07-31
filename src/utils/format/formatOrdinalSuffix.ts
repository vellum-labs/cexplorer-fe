export const formatOrdinalSuffix = (
  year: number,
): {
  year: number;
  suffix: string;
} => {
  if (year < 2) {
    return {
      year: 1,
      suffix: "st",
    };
  }

  const lastDigit = year % 10;
  const lastTwoDigits = year % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return {
      year,
      suffix: "th",
    };
  }

  switch (lastDigit) {
    case 2:
      return {
        year,
        suffix: "nd",
      };
    case 3:
      return {
        year,
        suffix: "rd",
      };
    default:
      return {
        year,
        suffix: "th",
      };
  }
};
