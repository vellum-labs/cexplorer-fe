import type { FC } from "react";

import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { OverviewCard } from "@/components/global/cards/OverviewCard";

interface TokenDashboardOverviewProps {}

export const TokenDashboardOverview: FC<TokenDashboardOverviewProps> = () => {
  const isLoading = false;
  const isError = false;

  const dexTradingVolume = [];

  const defiTrades = [];

  const uniqueTrades = [];

  return (
    <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-5 px-mobile pt-3 md:px-desktop xl:flex-nowrap xl:justify-start'>
      <div className='flex grow basis-[980px] flex-wrap items-stretch gap-5'>
        {isLoading ? (
          <>
            <LoadingSkeleton
              height='227px'
              rounded='xl'
              className='grow basis-[300px] px-8 py-4'
            />
            <LoadingSkeleton
              height='227px'
              rounded='xl'
              className='grow basis-[300px] px-8 py-4'
            />
            <LoadingSkeleton
              height='227px'
              rounded='xl'
              className='grow basis-[300px] px-8 py-4'
            />
          </>
        ) : (
          !isError && (
            <>
              <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                <OverviewCard
                  title='DEX trading volume'
                  overviewList={dexTradingVolume}
                  className='h-full'
                />
              </div>

              <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                <OverviewCard
                  title='DeFi trades'
                  overviewList={defiTrades}
                  className='h-full'
                />
              </div>
              <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                <OverviewCard
                  title='Unique traders'
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
