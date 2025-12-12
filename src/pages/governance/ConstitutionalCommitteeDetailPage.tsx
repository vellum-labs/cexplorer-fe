import type { FC } from "react";
import { createPortal } from "react-dom";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { FileText, AlertTriangle } from "lucide-react";

import { useFetchCommitteeDetail } from "@/services/governance";
import { useFetchConstitutionList } from "@/services/governance";
import { useFetchUrlContent } from "@/hooks/useFetchUrlContent";

import type {
  CommitteeDetailResponse,
  CommitteeMemberRegistration,
} from "@/types/governanceTypes";
import { CCMembersTab } from "@/components/gov/cc/tabs/CCMembersTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { CCGovernanceVotestab } from "@/components/gov/cc/tabs/CCGovernanceVotesTab";
import { PageBase } from "@/components/global/pages/PageBase";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { getCurrentConstitution } from "@/utils/getConstitutionStatus";

const getFirstRegistration = (
  reg: CommitteeMemberRegistration | CommitteeMemberRegistration[] | null,
): CommitteeMemberRegistration | null => {
  if (!reg) return null;
  if (Array.isArray(reg)) return reg[0] ?? null;
  return reg;
};

export const ConstituionalCommitteeDetailPage: FC = () => {
  const {
    content: modalContent,
    isLoading: isModalLoading,
    isOpen: isModalOpen,
    fetchContent: handleFullTextClick,
    close: closeModal,
  } = useFetchUrlContent();

  const committeeDetailQuery = useFetchCommitteeDetail();
  const constitutionListQuery = useFetchConstitutionList();
  const miscBasicQuery = useFetchMiscBasic();

  const { data: basicData } = miscBasicQuery;
  const miscConst = useMiscConst(basicData?.data.version.const);
  const currentEpoch = miscConst?.epoch?.no ?? 0;

  const committeeDetailResponse: CommitteeDetailResponse | undefined =
    committeeDetailQuery.data;
  const committeeDetail = committeeDetailResponse?.data;

  const constitutionItems = constitutionListQuery.data?.data?.data ?? [];
  const constitution = getCurrentConstitution(constitutionItems, currentEpoch);

  const currentMembers =
    committeeDetail?.member.filter(
      m => !m.expiration_epoch || m.expiration_epoch >= 0,
    ) ?? [];

  const activeMembers = currentMembers.filter(m => {
    const deReg = getFirstRegistration(m.de_registration);
    if (!deReg) {
      return true;
    }
    const deRegistrationDate = new Date(deReg.time);
    return deRegistrationDate > new Date();
  });

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
                  Active Members
                </span>
                <span className='text-textPrimary flex items-center gap-1 font-medium'>
                  {activeMembers.length}/{currentMembers.length}
                  {activeMembers.length < currentMembers.length && (
                    <Tooltip
                      content={`${currentMembers.length - activeMembers.length} member${currentMembers.length - activeMembers.length > 1 ? "s" : ""} retired`}
                    >
                      <AlertTriangle size={14} className='text-[#F79009]' />
                    </Tooltip>
                  )}
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
                <button
                  onClick={() => handleFullTextClick(constitution.anchor.url)}
                  className='flex items-center gap-1 text-text-sm text-primary hover:opacity-80'
                >
                  <FileText size={14} />
                  <span>Fulltext of the Cardano Constitution</span>
                </button>
              )}
            </div>

            <div className='bg-bgColor w-[456px] flex-grow-0 overflow-hidden rounded-l border border-border p-2 shadow-sm'>
              <AdsCarousel
                singleItem
                adCardClassname='!border-none !py-0'
                filterByType='drep'
                maxWidth={false}
                generateImageUrl={generateImageUrl}
                miscBasicQuery={miscBasicQuery}
              />
            </div>
          </div>
        )}
      </section>
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <Tabs withPadding={false} items={tabs} />
      </section>
      {isModalOpen &&
        createPortal(
          <Modal onClose={closeModal} maxWidth='900px'>
            <div className='p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  Constitution Full Text
                </h3>
              </div>
              {isModalLoading ? (
                <div className='flex flex-col gap-3'>
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                </div>
              ) : (
                <div className='rounded-lg text-sm max-h-[70vh] overflow-auto'>
                  <div
                    className='prose prose-sm dark:prose-invert max-w-none'
                    style={{
                      fontSize: "var(--font-size-text-sm)",
                      lineHeight: "1.6",
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {modalContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </Modal>,
          document.body,
        )}
    </PageBase>
  );
};
