import type { FC } from "react";
import { useMemo } from "react";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { getRouteApi } from "@tanstack/react-router";
import { formatString } from "@/utils/format/format";
import { Vote } from "lucide-react";

import { useFetchVoteDetail } from "@/services/governance";
import type { GovernanceVote } from "@/types/governanceTypes";
import Tabs from "@/components/global/Tabs";
import { VoteDetailCard } from "@/components/governance/vote/VoteDetailCard";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { PageBase } from "@/components/global/pages/PageBase";
import { EmptyState } from "@/components/global/EmptyState";

export const GovernanceVoteDetailPage: FC = () => {
  const route = getRouteApi("/gov/vote/$hash");
  const { hash } = route.useParams();

  const { data: voteData, isLoading } = useFetchVoteDetail(hash);
  const votes = voteData?.data?.data ?? [];

  const tabs = useMemo(() => {
    const govActionIds = votes.map((vote: GovernanceVote) => vote?.proposal?.ident?.id);
    const hasDuplicates = govActionIds.some(
      (id: string, index: number) => govActionIds.indexOf(id) !== index,
    );

    return votes.map((vote: GovernanceVote, index: number) => ({
      key: hasDuplicates
        ? `${vote?.proposal?.ident?.id}-${index}`
        : vote?.proposal?.ident?.id,
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

  return (
    <PageBase
      metadataTitle='govVoteDetail'
      metadataReplace={{
        before: "%tx%",
        after: hash,
      }}
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        {
          label: <span className='inline pt-1/2'>Votes</span>,
          link: "/gov/vote",
        },
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
      <div className='w-full max-w-desktop py-2'>
        {isLoading ? (
          <div className='w-full'>
            <div className='flex gap-1'>
              {[1, 2, 3].map(i => (
                <LoadingSkeleton
                  key={i}
                  width='80px'
                  height='32px'
                  className='rounded-s'
                />
              ))}
            </div>

            <div className='mt-2'>
              <VoteDetailCard
                vote={undefined as any}
                index={0}
                total={1}
                isLoading
              />
            </div>
          </div>
        ) : tabs.length > 1 ? (
          <Tabs items={tabs} allowScroll />
        ) : tabs.length === 1 ? (
          tabs[0].content
        ) : (
          <EmptyState
            icon={<Vote size={24} />}
            primaryText='No votes found'
            secondaryText="This transaction doesn't contain any governance votes."
          />
        )}
      </div>
    </PageBase>
  );
};
