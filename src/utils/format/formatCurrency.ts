import {
  currencySigns,
  currencyPosition,
  currencySpace,
} from "@/constants/currencies";
import { formatNumber } from "./format";

export const formatCurrency = (
  value: number | string,
  currency: string,
  options?: {
    applyNumberFormatting?: boolean;
  },
): string => {
  const { applyNumberFormatting = true } = options || {};

  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const formattedValue = applyNumberFormatting
    ? formatNumber(numericValue)
    : numericValue.toLocaleString();

  const symbol = currencySigns[currency] || currency.toUpperCase();
  const isSuffix = currencyPosition[currency] ?? false;
  const hasSpace = currencySpace[currency] ?? false;

  const space = hasSpace ? " " : "";

  if (isSuffix) {
    return `${formattedValue}${space}${symbol}`;
  }

  return `${symbol}${space}${formattedValue}`;
};
