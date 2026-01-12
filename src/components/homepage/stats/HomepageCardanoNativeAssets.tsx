import type { FC } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";

export const HomepageCardanoNativeAssets: FC = () => {
  const { t } = useAppTranslation("common");

  return (
    <div className='mx-1.5 min-h-[110px] flex-grow'>
      <div className='flex items-center gap-1 pb-2'>
        <span className='text-display-sm font-semibold'>TBD</span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayText'>
            {t("homepage.marketCap")}
          </span>
        </div>
        <span className='text-text-sm font-semibold text-grayText'>TBD</span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayText'>
            {t("homepage.circulatingSupply")}
          </span>
        </div>
        <span className='text-text-sm font-semibold text-grayText'>TBD</span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='inline-block text-text-sm font-medium text-grayText'>
            {t("homepage.activeStake")}
          </span>
        </div>
        <span className='text-text-sm font-semibold text-grayText'>TBD</span>
      </div>
    </div>
  );
};
