import type { FC } from "react";

import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TokenDashboardOverviewProps {}

export const TokenDashboardOverview: FC<TokenDashboardOverviewProps> = () => {
  const { t } = useAppTranslation("common");
  const isLoading = false;
  const isError = false;

  const dexTradingVolume = [];

  const defiTrades = [];

  const uniqueTrades = [];

  return (
    <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
      <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
        {isLoading ? (
          <>
            <LoadingSkeleton
              height='227px'
              rounded='xl'
              className='grow basis-[300px] px-4 py-2'
            />
            <LoadingSkeleton
              height='227px'
              rounded='xl'
              className='grow basis-[300px] px-4 py-2'
            />
            <LoadingSkeleton
              height='227px'
              rounded='xl'
              className='grow basis-[300px] px-4 py-2'
            />
          </>
        ) : (
          !isError && (
            <>
              <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                <OverviewCard
                  title={t("tokenDashboard.dexTradingVolume")}
                  overviewList={dexTradingVolume}
                  className='h-full'
                />
              </div>

              <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                <OverviewCard
                  title={t("tokenDashboard.defiTrades")}
                  overviewList={defiTrades}
                  className='h-full'
                />
              </div>
              <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                <OverviewCard
                  title={t("tokenDashboard.uniqueTraders")}
                  overviewList={uniqueTrades}
                  className='h-full'
                />
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};
