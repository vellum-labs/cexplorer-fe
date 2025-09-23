import { OverviewCard } from "../global/cards/OverviewCard";
import LoadingSkeleton from "../global/skeletons/LoadingSkeleton";
import { WatchlistSection } from "../global/watchlist/WatchlistSection";

import { usePoolDetail } from "@/hooks/details/usePoolDetail";
import type { useFetchPoolDetail } from "@/services/pools";

interface Props {
  query: ReturnType<typeof useFetchPoolDetail>;
  estimatedBlocks: number;
}

const PoolDetailOverview = ({ query, estimatedBlocks }: Props) => {
  const { data, aboutList, performanceList, stakeAndPledgeList } =
    usePoolDetail({ estimatedBlocks, query });

  return (
    <div className='flex w-full max-w-desktop flex-col gap-3 px-mobile lg:px-desktop'>
      <WatchlistSection
        ident={data?.pool_id}
        ticker={data?.pool_name?.ticker}
        isLoading={query.isLoading}
        poolDetailQuery={query}
      />
      <div className='flex w-full flex-wrap gap-5'>
        {query.isLoading ? (
          <>
            <LoadingSkeleton
              height='290px'
              rounded='xl'
              className='grow basis-[450px] lg:basis-[400px]'
            />
            <LoadingSkeleton
              height='290px'
              rounded='xl'
              className='grow basis-[450px] lg:basis-[400px]'
            />
            <LoadingSkeleton
              height='290px'
              rounded='xl'
              className='grow basis-[450px] lg:basis-[400px]'
            />
          </>
        ) : (
          <>
            <OverviewCard
              className='h-auto min-h-[290px]'
              title='About'
              overviewList={aboutList}
            />
            <OverviewCard
              className='h-auto min-h-[290px]'
              title='Stake and Pledge'
              overviewList={stakeAndPledgeList}
            />
            <OverviewCard
              className='h-auto min-h-[290px]'
              title='Performance'
              overviewList={performanceList}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PoolDetailOverview;
