import type { useFetchDrepDetail } from "@/services/drep";
import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

import { useDrepDetail } from "@/hooks/details/useDrepDetail";

interface DrepDetailOverviewProps {
  query: ReturnType<typeof useFetchDrepDetail>;
}

export const DrepDetailOverview: FC<DrepDetailOverviewProps> = ({ query }) => {
  const { about, governance, voting } = useDrepDetail({ query });

  return (
    <section className='flex w-full flex-col items-center'>
      <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
        <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
          {query.isLoading ? (
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
            !query.isError && (
              <>
                <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                  <OverviewCard
                    title='About'
                    overviewList={about}
                    className='h-full'
                  />
                </div>

                <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                  <OverviewCard
                    title='Voting'
                    overviewList={voting}
                    className='h-full'
                  />
                </div>

                <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                  <OverviewCard
                    title='Governance'
                    overviewList={governance}
                    className='h-full'
                  />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
};
