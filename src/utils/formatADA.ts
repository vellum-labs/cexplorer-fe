import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";

export const formatAbbreviatedADA = (lovelace: number): string => {
  const ada = lovelace / 1e6;
  return `₳${formatNumberWithSuffix(ada)}`;
};

export const formatFullADA = (lovelace: number): string => {
  const ada = lovelace / 1e6;
  return `₳${ada.toLocaleString()}`;
};
