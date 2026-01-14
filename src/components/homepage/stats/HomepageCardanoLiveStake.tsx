import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface HomepageCardanoLiveStakeProps {
  miscConst: MiscConstResponseData | undefined;
}

export const HomepageCardanoLiveStake: FC<HomepageCardanoLiveStakeProps> = ({
  miscConst,
}) => {
  const { t } = useAppTranslation("common");
  const supply = miscConst?.circulating_supply;
  const liveStake = miscConst?.live_stake;
  const progress = ((liveStake ?? 1) / (supply ?? 1)) * 100;
  const activeStake = miscConst?.epoch_stat?.stake?.active;

  return (
    <div className='mx-1.5 min-h-[110px] flex-grow'>
      <div className='flex w-full flex-col gap-1 pb-2'>
        <span className='text-display-sm font-semibold'>
          <AdaWithTooltip data={liveStake ?? 0} triggerClassName='!text-text' />
        </span>
        <div className='flex items-center gap-1.5'>
          <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
            <span
              className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
              style={{
                width: `${progress}%`,
              }}
            ></span>
          </div>
          <span className='text-grayText text-text-sm font-medium'>
            {progress.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='text-grayText inline-block text-text-sm font-medium'>
            {t("homepage.circulatingSupply")}
          </span>
        </div>
        {supply && (
          <span className='text-grayText text-text-sm font-semibold'>
            <AdaWithTooltip data={supply} />
          </span>
        )}
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1/2'>
          <span className='text-grayText inline-block text-text-sm font-medium'>
            {t("homepage.activeStake")}
          </span>
        </div>
        <span className='text-grayText text-text-sm font-semibold'>
          <AdaWithTooltip data={activeStake ?? 0} />
        </span>
      </div>
    </div>
  );
};
