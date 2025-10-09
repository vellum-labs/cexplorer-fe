import type { FC } from "react";

import { Tooltip } from "@/components/ui/tooltip";

import { currencySigns } from "@/constants/currencies";
import { useCurrencyStore } from "@/stores/currencyStore";
import { formatBitcoinWithSub } from "@/utils/format/formatSmallValue";
import { AdaWithTooltip } from "./AdaWithTooltip";

interface BlockDetailTransactionsOverviewTotalProps {
  sum: [string, number, number, number];
  ada: number;
}

export const TotalSumWithRates: FC<
  BlockDetailTransactionsOverviewTotalProps
> = ({ sum, ada }) => {
  const { currency } = useCurrencyStore();

  if (sum.includes(NaN)) return null;

  return (
    <div className='flex flex-wrap items-center gap-1/2 text-text-sm'>
      <span className='text-nowrap font-medium leading-none text-text'>
        <AdaWithTooltip data={ada} />
      </span>
      <span className='h-[20px] translate-y-[2px] pr-1/2 leading-none text-grayTextPrimary'>
        (
        <Tooltip
          content={
            <>
              {currencySigns[currency]}
              {sum[1]}
            </>
          }
        >
          <span>
            {currencySigns[currency]}
            {(+sum[1]).toFixed(2)}
          </span>
        </Tooltip>{" "}
        |{" "}
        <Tooltip content={<>₿{sum[2].toFixed(15)}</>}>
          {formatBitcoinWithSub(+sum[2])}
        </Tooltip>
        )
      </span>
    </div>
  );
};
