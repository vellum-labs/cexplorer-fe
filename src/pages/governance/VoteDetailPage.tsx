import type { FC } from "react";
import { useMemo } from "react";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { getRouteApi } from "@tanstack/react-router";
import { formatString } from "@/utils/format/format";

import { useFetchVoteDetail } from "@/services/governance";
import Tabs from "@/components/global/Tabs";
import { VoteDetailCard } from "@/components/governance/vote/VoteDetailCard";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { PageBase } from "@/components/global/pages/PageBase";

export const GovernanceVoteDetailPage: FC = () => {
  const route = getRouteApi("/gov/vote/$hash");
  const { hash } = route.useParams();
  const { tab } = route.useSearch() as { tab?: string };

  const { data: voteData, isLoading } = useFetchVoteDetail(hash);
  const votes = voteData?.data?.data ?? [];

  const tabs = useMemo(() => {
    return votes.map((vote, index) => ({
      key: `vote_${index + 1}`,
      label: `Vote ${index + 1}`,
      content: (
        <VoteDetailCard
          vote={vote}
          index={index}
          total={votes.length}
          isLoading={isLoading}
        />
      ),
      visible: true,
    }));
  }, [votes, isLoading]);

  const activeTabValue = useMemo(() => {
    if (!tab || !votes.length) return undefined;
    
    const matchingVoteIndex = votes.findIndex(vote => vote?.proposal?.ident?.id === tab);
    return matchingVoteIndex !== -1 ? `vote_${matchingVoteIndex + 1}` : undefined;
  }, [tab, votes]);

  return (
    <PageBase
      metadataTitle='govVoteDetail'
      metadataReplace={{
        before: "%tx%",
        after: hash,
      }}
      breadcrumbItems={[
        { label: <span className='inline pt-1'>Governance</span> },
        {
          label: <span>{formatString(hash ?? "", "long")}</span>,
          ident: hash,
        },
      ]}
      title='Vote detail'
      subTitle={
        <HeaderBannerSubtitle
          hashString={formatString(hash ?? "", "long")}
          hash={hash}
        />
      }
    >
      <div className='w-full max-w-desktop py-4'>
        {isLoading ? (
          <div className='w-full'>
            <div className='flex gap-2'>
              {[1, 2, 3].map(i => (
                <LoadingSkeleton
                  key={i}
                  width='80px'
                  height='32px'
                  className='rounded-md'
                />
              ))}
            </div>

            <div className='mt-4'>
              <VoteDetailCard
                vote={undefined as any}
                index={0}
                total={1}
                isLoading
              />
            </div>
          </div>
        ) : tabs.length > 0 ? (
          <Tabs items={tabs} activeTabValue={activeTabValue} />
        ) : (
          <p className='text-muted text-center'>
            No votes found for this transaction.
          </p>
        )}
      </div>
    </PageBase>
  );
};
