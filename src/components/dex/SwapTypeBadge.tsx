import type { FC } from "react";
import { ArrowLeftRight } from "lucide-react";
import DexhunterIcon from "@/resources/images/icons/dexhunter.svg";

interface SwapTypeBadgeProps {
  uniqueDexesCount: number;
  hasDexhunter: boolean;
}

export const SwapTypeBadge: FC<SwapTypeBadgeProps> = ({
  uniqueDexesCount,
  hasDexhunter,
}) => {
  const isDirectSwap = uniqueDexesCount === 1;
  const isAggregatorSwap = uniqueDexesCount > 1;

  return (
    <div className='flex items-center gap-2'>
      {hasDexhunter && (
        <div className='flex w-fit items-center gap-1 rounded-m border border-border px-1 text-text-sm'>
          <img src={DexhunterIcon} alt='Dexhunter' height={15} width={15} />
          <span>Dexhunter</span>
        </div>
      )}
      {isDirectSwap && (
        <div className='flex w-fit items-center gap-1 rounded-m border border-border px-1 text-text-sm'>
          <ArrowLeftRight size={15} className='text-primary' />
          <span>Direct swap</span>
        </div>
      )}
      {isAggregatorSwap && (
        <div className='flex w-fit items-center gap-1 rounded-m border border-border px-1 text-text-sm'>
          <ArrowLeftRight size={15} className='text-primary' />
          <span>Aggregator swap</span>
        </div>
      )}
    </div>
  );
};
