import type { FC } from "react";

import { colors } from "@/constants/colors";
import { Cardano } from "@vellumlabs/cexplorer-sdk";
import { CircleHelp } from "lucide-react";

import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { formatCurrency } from "@vellumlabs/cexplorer-sdk";

import Bitcoin from "@/resources/images/wallet/bitcoin.svg";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { AdaPriceTableSkeleton } from "./AdaPriceTableSkeleton";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const AdaPriceTable: FC = () => {
  const { t } = useAppTranslation("common");
  const price = useAdaPriceWithHistory();
  const { currency } = useCurrencyStore();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  if (price.percentChange === undefined) return <AdaPriceTableSkeleton />;

  const { genesisParams } = configJSON;

  const totalSupply = genesisParams[0].shelley[0].maxLovelaceSupply;
  const formattedMaxSupply = lovelaceToAda(totalSupply);

  return (
    <div className='flex w-full flex-col rounded-m border border-border bg-cardBg pb-2 pt-2 lg:min-w-[390px] lg:max-w-[400px] lg:pb-0'>
      <div className='flex h-[110px] w-full flex-col gap-1/2 border-b border-border px-3 pb-2'>
        <div className='flex items-center gap-1'>
          <div className='flex h-[36px] w-[36px] shrink-0 items-center justify-center gap-1/2 rounded-s border border-border'>
            <Cardano size={20} color={colors.text} />
          </div>
          <h3>Cardano</h3>
          <span className='text-text-sm text-grayTextPrimary'>
            {t("adaPrice.adaPrice")}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-display-xs font-semibold'>
            {formatCurrency(Number(price.todayValue.toFixed(2)), currency, {
              applyNumberFormatting: false,
            })}
          </span>
          <span
            className={`ml-0.5 flex items-center rounded-max border px-1/2 py-1/4 text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "text-yellowText" : price.percentChange > 0 ? "text-greenText" : "text-redText"}`}
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
        <div className='flex items-center gap-1/2'>
          <span className='text-text-xs font-medium text-grayTextPrimary'>
            {Math.round(price.adaToSats)}
          </span>
          <div className='flex items-center gap-1/2'>
            <img src={Bitcoin} alt='btc' className='h-[14px] w-[14px]' />
            <span className='text-text-xs font-medium text-grayTextPrimary'>
              {t("adaPrice.sats")}
            </span>
          </div>
        </div>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-3'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayTextPrimary'>
            {t("adaPrice.marketCap")}
          </span>
          <Tooltip content={t("adaPrice.marketCapTooltip")}>
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
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayTextPrimary'>
            {t("adaPrice.fdv")}
          </span>
          <Tooltip
            content={t("adaPrice.fdvTooltip", {
              maxSupply: formattedMaxSupply,
            })}
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
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayTextPrimary'>
            {t("adaPrice.circulatingSupply")}
          </span>
          <Tooltip content={t("adaPrice.circulatingSupplyTooltip")}>
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
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayTextPrimary'>
            {t("adaPrice.totalSupply")}
          </span>
          <Tooltip
            content={t("adaPrice.totalSupplyTooltip", {
              maxSupply: formattedMaxSupply,
            })}
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
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayTextPrimary'>
            {t("adaPrice.adaStaked")}
          </span>
          <Tooltip content={t("adaPrice.adaStakedTooltip")}>
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
