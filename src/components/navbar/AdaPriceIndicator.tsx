import { colors } from "@/constants/colors";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { Cardano } from "@/resources/images/icons/Cardano";
import { Link } from "@tanstack/react-router";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { useCurrencyStore } from "@/stores/currencyStore";
import { formatCurrency } from "@/utils/format/formatCurrency";

export const AdaPriceIndicator = () => {
  const price = useAdaPriceWithHistory();
  const { currency } = useCurrencyStore();

  if (price.percentChange === undefined) {
    return (
      <>
        <div className='flex items-center gap-1/2 text-text-xs font-medium'>
          <Cardano size={18} color={colors.text} />
          <span className='text-grayTextPrimary'>ADA:</span>
          <span
            className={`ml-0.5 flex items-center rounded-max border border-red-500/40 bg-red-500/5 px-1/2 py-1/4 text-[11px] font-medium text-redText`}
          >
            N/A
          </span>
        </div>
      </>
    );
  }

  return (
    <Tooltip content={<div className='w-[100px]'>24h difference</div>}>
      <Link to='/ada-price'>
        <div className='flex items-center gap-1/2 text-text-xs font-medium'>
          <Cardano size={18} color={colors.text} />
          <span className='text-grayTextPrimary'>
            ADA:{" "}
            {formatCurrency(Number(price.todayValue.toFixed(2)), currency, {
              applyNumberFormatting: false,
            })}
          </span>
          <span
            className={`ml-0.5 flex items-center rounded-max px-1/2 py-1/4 text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "text-yellowText" : price.percentChange > 0 ? "text-greenText" : "text-redText"}`}
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
        <div className='-mt-0.5 ml-[21px] flex items-center gap-1/2 text-[10px] text-grayTextSecondary'>
          ({Math.round(price.adaToSats)} sats)
        </div>
      </Link>
    </Tooltip>
  );
};
