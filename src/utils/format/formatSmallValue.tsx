import type { ReactNode } from "react";

export const formatSmallValueWithSub = (
  value: number,
  symbol: string,
  threshold = 0.001,
  decimals = 3,
  significantDigitsCount = 2
): ReactNode => {
  if (value === 0) return <span>{symbol}0</span>;
  if (value >= threshold) return <span>{symbol}{value.toFixed(decimals)}</span>;

  const str = value.toFixed(20);
  const afterDecimal = str.slice(2); // Skip "0."

  let leadingZeros = 0;
  for (const char of afterDecimal) {
    if (char === '0') leadingZeros++;
    else break;
  }

  // Get significant digits based on significantDigitsCount parameter
  const remainingDigits = afterDecimal.slice(leadingZeros);
  const digitsToGet = significantDigitsCount + 1; // Get one extra for rounding
  const firstDigits = remainingDigits.slice(0, digitsToGet);
  const rounded = Math.round(parseInt(firstDigits) / 10);
  const significantDigits = rounded.toString().slice(0, significantDigitsCount);

  return (
    <span>
      {symbol}0.0<span style={{ fontSize: "0.7em", verticalAlign: "sub" }}>{leadingZeros}</span>{significantDigits}
    </span>
  );
};

// Bitcoin-specific wrapper for backward compatibility
export const formatBitcoinWithSub = (value: number): ReactNode => {
  return formatSmallValueWithSub(value, "₿", 0.001, 3);
};
