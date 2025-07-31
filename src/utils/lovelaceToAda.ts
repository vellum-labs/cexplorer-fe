import { formatNumberWithSuffix } from "./format/format";

export const lovelaceToAda = (lovelace: number): string => {
  const ada = lovelace / 1e6;

  return `₳ ${formatNumberWithSuffix(ada)}`;
};
