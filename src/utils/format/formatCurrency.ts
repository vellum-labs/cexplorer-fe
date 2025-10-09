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
    useFormatNumber?: boolean;
  },
): string => {
  const { useFormatNumber = true } = options || {};

  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const formattedValue = useFormatNumber
    ? formatNumber(numericValue)
    : numericValue.toLocaleString();

  const symbol =
    currencySigns[currency as keyof typeof currencySigns] ||
    currency.toUpperCase();
  const isSuffix =
    currencyPosition[currency as keyof typeof currencyPosition] ?? false;
  const hasSpace =
    currencySpace[currency as keyof typeof currencySpace] ?? false;

  const space = hasSpace ? " " : "";

  if (isSuffix) {
    return `${formattedValue}${space}${symbol}`;
  }

  return `${symbol}${space}${formattedValue}`;
};
