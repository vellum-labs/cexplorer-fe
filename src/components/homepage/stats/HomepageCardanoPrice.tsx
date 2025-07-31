import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { useCurrencyStore } from "@/stores/currencyStore";

import { currencySigns } from "@/constants/currencies";
import { formatNumber } from "@/utils/format/format";

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
    <div className='mx-3 min-h-[110px] flex-grow'>
      <div className='flex items-center gap-2 pb-4'>
        <span className='text-3xl font-semibold'>{price.today}</span>
        <span
          className={`ml-0.5 flex max-h-[22px] items-center rounded-full border px-1 py-0.5 text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "border-yellow-500/40 bg-yellow-500/5 text-yellowText" : price.percentChange > 0 ? "border-green-500/40 bg-green-500/5 text-greenText" : "border-red-500/40 bg-red-500/5 text-redText"}`}
        >
          {price.percentChange > 0 && "+"}
          {price.percentChange?.toFixed(1)}%
        </span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayText'>
            Market cap
          </span>
        </div>
        <span className='text-sm font-semibold text-grayText'>
          {currencySigns[currency]}
          {miscConst?.circulating_supply
            ? formatNumber(
                Math.round(
                  (miscConst.circulating_supply / 1e6) * price.todayValue,
                ),
              )
            : "-"}
        </span>
      </div>
      <div className='flex flex-grow items-center'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayText'>
            ADA/BTC
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-xs font-medium text-grayText'>
            {Math.round(price.adaToSats)}
          </span>
          <div className='flex items-center gap-1'>
            <img src={Bitcoin} alt='btc' className='h-[14px] w-[14px]' />
            <span className='text-xs font-medium text-grayText'>sats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
