import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const safeFormatNumber = (
  value: number | string | null | undefined,
) => {
  if (value === null || value === undefined) return null;
  return formatNumber(value);
};
