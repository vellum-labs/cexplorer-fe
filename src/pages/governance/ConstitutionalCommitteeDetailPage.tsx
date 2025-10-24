import type { FC } from "react";
import { useState } from "react";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import AdsCarousel from "@/components/global/ads/AdsCarousel";
import { FileText } from "lucide-react";

import { useFetchCommitteeDetail } from "@/services/governance";
import { useFetchConstitutionList } from "@/services/governance";

import type { CommitteeDetailResponse } from "@/types/governanceTypes";
import { CCMembersTab } from "@/components/gov/cc/tabs/CCMembersTab";
import Tabs from "@/components/global/Tabs";
import { CCGovernanceVotestab } from "@/components/gov/cc/tabs/CCGovernanceVotesTab";
import { PageBase } from "@/components/global/pages/PageBase";
import { SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { transformAnchorUrl } from "@/utils/format/transformAnchorUrl";

export const ConstituionalCommitteeDetailPage: FC = () => {
  const [clickedUrl, setClickedUrl] = useState<string | undefined>(undefined);
  const committeeDetailQuery = useFetchCommitteeDetail();
  const constitutionListQuery = useFetchConstitutionList();

  const committeeDetailResponse: CommitteeDetailResponse | undefined =
    committeeDetailQuery.data;
  const committeeDetail = committeeDetailResponse?.data;
  const constitution = constitutionListQuery.data?.data?.data?.[0];

  const currentMembers =
    committeeDetail?.member.filter(
      m => !m.expiration_epoch || m.expiration_epoch >= 0,
    ) ?? [];

  const isLoading =
    committeeDetailQuery.isLoading || constitutionListQuery.isLoading;

  const tabs = [
    {
      key: "members",
      label: "Members",
      content: <CCMembersTab />,
      visible: true,
    },
    {
      key: "governance_vote",
      label: "Governance vote",
      content: <CCGovernanceVotestab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='committee'
      title='Constitutional Committee'
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        { label: "Constitutional committee" },
      ]}
      adsCarousel={false}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        {isLoading ? (
          <div className='flex w-full flex-wrap gap-2'>
            <LoadingSkeleton width='456px' height='158px' rounded='xl' />
            <LoadingSkeleton width='456px' height='158px' rounded='xl' />
            <LoadingSkeleton width='456px' height='158px' rounded='xl' />
          </div>
        ) : (
          <div className='flex h-full w-full flex-wrap items-stretch gap-2 lg:flex-nowrap'>
            <div className='bg-bgColor flex w-[456px] flex-grow-0 flex-col gap-2 rounded-l border border-border p-3 shadow-sm'>
              <h3 className='text-textPrimary text-text-lg font-semibold'>
                About
              </h3>

              <div className='flex items-center justify-start text-text-sm'>
                <span className='min-w-[150px] text-grayTextSecondary'>
                  Members
                </span>
                <span className='text-textPrimary font-medium'>
                  {currentMembers.length}/
                  {committeeDetail?.member.length ?? "-"}
                </span>
              </div>

              <div className='flex items-center justify-start text-text-sm'>
                <span className='min-w-[150px] text-grayTextSecondary'>
                  Voting threshold
                </span>
                <span className='text-textPrimary font-medium'>
                  {committeeDetail?.committee?.quorum_numerator &&
                  committeeDetail?.committee?.quorum_denominator
                    ? `${Math.round(
                        (committeeDetail.committee.quorum_numerator /
                          committeeDetail.committee.quorum_denominator) *
                          100,
                      )}%`
                    : "-"}
                </span>
              </div>
            </div>

            <div className='bg-bgColor flex w-[456px] flex-grow-0 flex-col gap-1.5 rounded-l border border-border p-3 shadow-sm'>
              <div className='flex items-center gap-1/2'>
                <div className='flex h-8 w-8 items-center justify-center'>
                  <FileText size={18} className='text-primary' />
                </div>
                <h3 className='text-textPrimary text-text-lg font-semibold'>
                  Constitution
                </h3>
              </div>

              {constitution?.anchor?.data_hash && (
                <div className='text-textPrimary break-all text-text-sm font-semibold'>
                  {constitution.anchor.data_hash}
                </div>
              )}

              {constitution?.anchor?.url && (
                <a
                  href={transformAnchorUrl(constitution.anchor.url)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='break-all text-text-sm text-primary'
                  onClick={e => {
                    e.preventDefault();
                    const transformedUrl = transformAnchorUrl(
                      constitution.anchor.url,
                    );
                    setClickedUrl(transformedUrl);
                  }}
                >
                  Fulltext of the Cardano Constitution
                </a>
              )}
            </div>

            <div className='bg-bgColor w-[456px] flex-grow-0 overflow-hidden rounded-l border border-border p-2 shadow-sm'>
              <AdsCarousel
                singleItem
                adCardClassname='!border-none !py-0'
                filterByType='drep'
                maxWidth={false}
              />
            </div>
          </div>
        )}
      </section>
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <Tabs withPadding={false} items={tabs} />
      </section>
      {clickedUrl && (
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => setClickedUrl(undefined)}
        />
      )}
    </PageBase>
  );
};
