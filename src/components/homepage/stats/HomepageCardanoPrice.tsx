import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";

import { formatCurrency } from "@vellumlabs/cexplorer-sdk";

import Bitcoin from "@/resources/images/wallet/bitcoin.svg";

interface HomepageCardanoPriceProps {
  miscConst: MiscConstResponseData | undefined;
}

export const HomepageCardanoPrice: FC<HomepageCardanoPriceProps> = ({
  miscConst,
}) => {
  const price = useAdaPriceWithHistory() as any;
  const { currency } = useCurrencyStore();

  return (
    <div className='mx-1.5 min-h-[110px] flex-grow'>
      <div className='flex items-center gap-1 pb-2'>
        <span className='text-display-sm font-semibold'>{price.today}</span>
        <span
          className={`ml-0.5 flex max-h-[22px] items-center rounded-max border px-1/2 py-1/4 text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "text-yellowText" : price.percentChange > 0 ? "text-greenText" : "text-redText"}`}
          style={{
            border: `1px solid ${
              price.percentChange < 1 && price.percentChange > -1
                ? "rgba(234, 179, 8, 0.4)"
                : price.percentChange > 0
                  ? "rgba(34, 197, 94, 0.4)"
                  : "rgba(239, 68, 68, 0.4)"
            }`,
            backgroundColor:
              price.percentChange < 1 && price.percentChange > -1
                ? "rgba(234, 179, 8, 0.05)"
                : price.percentChange > 0
                  ? "rgba(34, 197, 94, 0.05)"
                  : "rgba(239, 68, 68, 0.05)",
          }}
        >
          {price.percentChange > 0 && "+"}
          {price.percentChange?.toFixed(1)}%
        </span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='text-grayText inline-block text-text-sm font-medium'>
            Market cap
          </span>
        </div>
        <span className='text-grayText text-text-sm font-semibold'>
          {miscConst?.circulating_supply
            ? formatCurrency(
                Math.round(
                  (miscConst.circulating_supply / 1e6) * price.todayValue,
                ),
                currency,
              )
            : "-"}
        </span>
      </div>
      <div className='flex flex-grow items-center'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='text-grayText inline-block text-text-sm font-medium'>
            ADA/BTC
          </span>
        </div>
        <div className='flex items-center gap-1/2'>
          <span className='text-grayText text-text-xs font-medium'>
            {Math.round(price.adaToSats)}
          </span>
          <div className='flex items-center gap-1/2'>
            <img src={Bitcoin} alt='btc' className='h-[14px] w-[14px]' />
            <span className='text-grayText text-text-xs font-medium'>sats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
