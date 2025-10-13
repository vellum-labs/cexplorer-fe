import type { FC } from "react";

import { colors } from "@/constants/colors";
import { Cardano } from "@/resources/images/icons/Cardano";
import { CircleHelp } from "lucide-react";

import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useCurrencyStore } from "@/stores/currencyStore";

import { formatNumber } from "@/utils/format/format";
import { formatCurrency } from "@/utils/format/formatCurrency";

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
    <div className='rounded-m flex w-full flex-col border border-border bg-cardBg pb-2 pt-2 lg:min-w-[390px] lg:max-w-[400px] lg:pb-0'>
      <div className='gap-1/2 flex h-[110px] w-full flex-col border-b border-border px-3 pb-2'>
        <div className='flex items-center gap-1'>
          <div className='gap-1/2 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-s border border-border'>
            <Cardano size={20} color={colors.text} />
          </div>
          <h3>Cardano</h3>
          <span className='text-text-sm text-grayTextPrimary'>ADA Price</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-display-xs font-semibold'>
            {formatCurrency(Number(price.todayValue.toFixed(2)), currency, {
              applyNumberFormatting: false,
            })}
          </span>
          <span
            className={`rounded-max px-1/2 py-1/4 ml-0.5 flex items-center border text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "border-yellow-500/40 bg-yellow-500/5 text-yellowText" : price.percentChange > 0 ? "border-green-500/40 bg-green-500/5 text-greenText" : "border-red-500/40 bg-red-500/5 text-redText"}`}
          >
            {price.percentChange > 0 && "+"}
            {price.percentChange?.toFixed(1)}%
          </span>
        </div>
        <div className='gap-1/2 flex items-center'>
          <span className='text-text-xs font-medium text-grayTextPrimary'>
            {Math.round(price.adaToSats)}
          </span>
          <div className='gap-1/2 flex items-center'>
            <img src={Bitcoin} alt='btc' className='h-[14px] w-[14px]' />
            <span className='text-text-xs font-medium text-grayTextPrimary'>
              sats
            </span>
          </div>
        </div>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-3'>
        <div className='gap-1/2 flex min-w-[160px] items-center'>
          <span className='text-text-sm inline-block font-medium text-grayTextPrimary'>
            Market cap
          </span>
          <Tooltip content='ADA price × circulating supply'>
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-text-sm font-semibold text-grayTextPrimary'>
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

      <div className='flex h-[50px] flex-grow items-center border-b border-border bg-darker px-3'>
        <div className='gap-1/2 flex min-w-[160px] items-center'>
          <span className='text-text-sm inline-block font-medium text-grayTextPrimary'>
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
        <span className='text-text-sm font-semibold text-grayTextPrimary'>
          {miscConst?.circulating_supply
            ? formatCurrency(
                Math.round((totalSupply / 1e6) * price.todayValue),
                currency,
              )
            : "-"}
        </span>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-3'>
        <div className='gap-1/2 flex min-w-[160px] items-center'>
          <span className='text-text-sm inline-block font-medium text-grayTextPrimary'>
            Circulating supply
          </span>
          <Tooltip content='ADA currently in circulation (not locked or unminted)'>
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-text-sm font-semibold text-grayTextPrimary'>
          {miscConst?.circulating_supply
            ? `${formatNumber(Math.round(miscConst?.circulating_supply / 1e6))} (${(((miscConst?.circulating_supply / 1e6) * 100) / Number(totalSupply / 1e6)).toFixed(2)}%)`
            : "-"}
        </span>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border bg-darker px-3'>
        <div className='gap-1/2 flex min-w-[160px] items-center'>
          <span className='text-text-sm inline-block font-medium text-grayTextPrimary'>
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
        <span className='text-text-sm font-semibold text-grayTextPrimary'>
          {formatNumber(Math.round(totalSupply / 1e6))}
        </span>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b px-3 lg:border-none'>
        <div className='gap-1/2 flex min-w-[160px] items-center'>
          <span className='text-text-sm inline-block font-medium text-grayTextPrimary'>
            ADA staked
          </span>
          <Tooltip content='ADA delegated to stake pools (out of circulating supply)'>
            <CircleHelp
              size={12}
              className='translate-y-[1px] cursor-pointer text-grayTextPrimary'
            />
          </Tooltip>
        </div>
        <span className='text-text-sm font-semibold text-grayTextPrimary'>
          {miscConst?.live_stake && miscConst?.circulating_supply
            ? `${formatNumber(Math.round(miscConst.live_stake / 1e6))} (${(((miscConst.live_stake / 1e6) * 100) / (miscConst.circulating_supply / 1e6)).toFixed(2)}%)`
            : "-"}
        </span>
      </div>
    </div>
  );
};
