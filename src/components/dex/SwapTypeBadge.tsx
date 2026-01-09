import type { FC } from "react";
import { ArrowLeftRight } from "lucide-react";
import DexhunterIcon from "@/resources/images/icons/dexhunter.svg";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface SwapTypeBadgeProps {
  uniqueDexesCount: number;
  hasDexhunter: boolean;
}

export const SwapTypeBadge: FC<SwapTypeBadgeProps> = ({
  uniqueDexesCount,
  hasDexhunter,
}) => {
  const { t } = useAppTranslation("common");
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
          <span>{t("dex.directSwap")}</span>
        </div>
      )}
      {isAggregatorSwap && (
        <div className='flex w-fit items-center gap-1 rounded-m border border-border px-1 text-text-sm'>
          <ArrowLeftRight size={15} className='text-primary' />
          <span>{t("dex.aggregatorSwap")}</span>
        </div>
      )}
    </div>
  );
};
