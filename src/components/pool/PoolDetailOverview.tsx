import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { WatchlistSection } from "../global/watchlist/WatchlistSection";

import { usePoolDetail } from "@/hooks/details/usePoolDetail";
import type { useFetchPoolDetail } from "@/services/pools";
import type { MiscConstResponseData } from "@/types/miscTypes";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  query: ReturnType<typeof useFetchPoolDetail>;
  estimatedBlocks: number;
  miscConst: MiscConstResponseData | undefined;
  isPoolRetiredOrRetiring?: boolean;
}

const PoolDetailOverview = ({
  query,
  estimatedBlocks,
  miscConst,
  isPoolRetiredOrRetiring = false,
}: Props) => {
  const { t } = useAppTranslation("pages");
  const { data, aboutList, performanceList, stakeAndPledgeList } =
    usePoolDetail({ estimatedBlocks, query, miscConst });

  return (
    <div className='flex w-full max-w-desktop flex-col gap-1.5 px-mobile lg:px-desktop'>
      <WatchlistSection
        ident={data?.pool_id}
        ticker={data?.pool_name?.ticker}
        isLoading={query.isLoading}
        poolDetailQuery={query}
        isPoolRetiredOrRetiring={isPoolRetiredOrRetiring}
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
            <OverviewCard
              title={t("pools.detailPage.about.title")}
              overviewList={aboutList}
            />
            <OverviewCard
              title={t("pools.detailPage.stakeAndPledge.title")}
              overviewList={stakeAndPledgeList}
            />
            <OverviewCard
              title={t("pools.detailPage.performance.title")}
              overviewList={performanceList}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PoolDetailOverview;
