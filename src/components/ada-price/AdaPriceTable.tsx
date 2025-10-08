import type { FC } from "react";

import { colors } from "@/constants/colors";
import { Cardano } from "@/resources/images/icons/Cardano";
import { CircleHelp } from "lucide-react";

import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useCurrencyStore } from "@/stores/currencyStore";

import { currencySigns } from "@/constants/currencies";
import { formatNumber } from "@/utils/format/format";

import Bitcoin from "@/resources/images/wallet/bitcoin.svg";
import { Tooltip } from "@/components/ui/tooltip";
import { configJSON } from "@/constants/conf";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { AdaPriceTableSkeleton } from "./AdaPriceTableSkeleton";

export const AdaPriceTable: FC = () => {
  const price = useAdaPriceWithHistory();
  const { currency } = useCurrencyStore();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  if (price.percentChange === undefined) return <AdaPriceTableSkeleton />;

  const { genesisParams } = configJSON;

  const totalSupply = genesisParams[0].shelley[0].maxLovelaceSupply;

  return (
    <div className='flex w-full flex-col rounded-lg border border-border bg-cardBg pb-4 pt-4 lg:min-w-[390px] lg:max-w-[400px] lg:pb-0'>
      <div className='flex h-[110px] w-full flex-col gap-1 border-b border-border px-6 pb-4'>
        <div className='flex items-center gap-2'>
          <div className='flex h-[36px] w-[36px] shrink-0 items-center justify-center gap-1 rounded-md border border-border'>
            <Cardano size={20} color={colors.text} />
          </div>
          <h3>Cardano</h3>
          <span className='text-sm text-grayTextPrimary'>ADA Price</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-2xl font-semibold'>{price.today}</span>
          <span
            className={`ml-0.5 flex items-center rounded-full border px-1 py-0.5 text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "border-yellow-500/40 bg-yellow-500/5 text-yellowText" : price.percentChange > 0 ? "border-green-500/40 bg-green-500/5 text-greenText" : "border-red-500/40 bg-red-500/5 text-redText"}`}
          >
            {price.percentChange > 0 && "+"}
            {price.percentChange?.toFixed(1)}%
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-xs font-medium text-grayTextPrimary'>
            {Math.round(price.adaToSats)}
          </span>
          <div className='flex items-center gap-1'>
            <img src={Bitcoin} alt='btc' className='h-[14px] w-[14px]' />
            <span className='text-xs font-medium text-grayTextPrimary'>
              sats
            </span>
          </div>
        </div>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayTextPrimary'>
            Market cap
          </span>
          <Tooltip content='ADA price × circulating supply'>
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-sm font-semibold text-grayTextPrimary'>
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

      <div className='flex h-[50px] flex-grow items-center border-b border-border bg-darker px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayTextPrimary'>
            FDV
          </span>
          <Tooltip
            content={`Fully Diluted Valuation = ADA price × max supply (${lovelaceToAda(totalSupply)})`}
          >
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-sm font-semibold text-grayTextPrimary'>
          {currencySigns[currency]}
          {miscConst?.circulating_supply
            ? formatNumber(Math.round((totalSupply / 1e6) * price.todayValue))
            : "-"}
        </span>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayTextPrimary'>
            Circulating supply
          </span>
          <Tooltip content='ADA currently in circulation (not locked or unminted)'>
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-sm font-semibold text-grayTextPrimary'>
          {miscConst?.circulating_supply
            ? `${formatNumber(Math.round(miscConst?.circulating_supply / 1e6))} (${(((miscConst?.circulating_supply / 1e6) * 100) / Number(totalSupply / 1e6)).toFixed(2)}%)`
            : "-"}
        </span>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border bg-darker px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayTextPrimary'>
            Total supply
          </span>
          <Tooltip
            content={`The maximum number of ADA that will ever exist (${lovelaceToAda(totalSupply)})`}
          >
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-sm font-semibold text-grayTextPrimary'>
          {formatNumber(Math.round(totalSupply / 1e6))}
        </span>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b px-6 lg:border-none'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayTextPrimary'>
            ADA staked
          </span>
          <Tooltip content='ADA delegated to stake pools (out of circulating supply)'>
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-sm font-semibold text-grayTextPrimary'>
          {miscConst?.live_stake && miscConst?.circulating_supply
            ? `${formatNumber(Math.round(miscConst.live_stake / 1e6))} (${(((miscConst.live_stake / 1e6) * 100) / (miscConst.circulating_supply / 1e6)).toFixed(2)}%)`
            : "-"}
        </span>
      </div>
    </div>
  );
};
