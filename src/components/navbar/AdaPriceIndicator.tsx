import { colors } from "@/constants/colors";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { Cardano } from "@/resources/images/icons/Cardano";
import { Link } from "@tanstack/react-router";
import { Tooltip } from "../ui/tooltip";

export const AdaPriceIndicator = () => {
  const price = useAdaPriceWithHistory();

  if (price.percentChange === undefined) {
    return (
      <>
        <div className='flex items-center gap-1/2 text-xs font-medium'>
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
        <div className='flex items-center gap-1/2 text-xs font-medium'>
          <Cardano size={18} color={colors.text} />
          <span className='text-grayTextPrimary'>ADA: {price.today}</span>
          <span
            className={`ml-0.5 flex items-center rounded-max border px-1/2 py-1/4 text-[11px] font-medium ${price.percentChange < 1 && price.percentChange > -1 ? "border-yellow-500/40 bg-yellow-500/5 text-yellowText" : price.percentChange > 0 ? "border-green-500/40 bg-green-500/5 text-greenText" : "border-red-500/40 bg-red-500/5 text-redText"}`}
          >
            {price.percentChange > 0 && "+"}
            {price.percentChange?.toFixed(1)}%
          </span>
        </div>
        <div className='-mt-1 ml-[21px] flex items-center gap-1/2 text-[10px] text-grayTextSecondary'>
          ({Math.round(price.adaToSats)} sats)
        </div>
      </Link>
    </Tooltip>
  );
};
