import { OverviewCard } from "../global/cards/OverviewCard";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { WatchlistSection } from "../global/watchlist/WatchlistSection";

import { usePoolDetail } from "@/hooks/details/usePoolDetail";
import type { useFetchPoolDetail } from "@/services/pools";
import type { MiscConstResponseData } from "@/types/miscTypes";

interface Props {
  query: ReturnType<typeof useFetchPoolDetail>;
  estimatedBlocks: number;
  miscConst: MiscConstResponseData | undefined;
}

const PoolDetailOverview = ({ query, estimatedBlocks, miscConst }: Props) => {
  const { data, aboutList, performanceList, stakeAndPledgeList } =
    usePoolDetail({ estimatedBlocks, query, miscConst });

  return (
    <div className='flex w-full max-w-desktop flex-col gap-1.5 px-mobile lg:px-desktop'>
      <WatchlistSection
        ident={data?.pool_id}
        ticker={data?.pool_name?.ticker}
        isLoading={query.isLoading}
        poolDetailQuery={query}
      />
      <div className='flex w-full flex-wrap items-stretch gap-3'>
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
            <OverviewCard title='About' overviewList={aboutList} />
            <OverviewCard
              title='Stake and Pledge'
              overviewList={stakeAndPledgeList}
            />
            <OverviewCard title='Performance' overviewList={performanceList} />
          </>
        )}
      </div>
    </div>
  );
};

export default PoolDetailOverview;
