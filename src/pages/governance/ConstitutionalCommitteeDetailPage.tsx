import type { FC } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useFetchCommitteeDetail } from "@/services/governance";
import { useFetchConstitutionList } from "@/services/governance";

import type { CommitteeDetailResponse } from "@/types/governanceTypes";
import { CCMembersTab } from "@/components/gov/cc/tabs/CCMembersTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { CCGovernanceVotestab } from "@/components/gov/cc/tabs/CCGovernanceVotesTab";
import { PageBase } from "@/components/global/pages/PageBase";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { getCurrentConstitution } from "@/utils/getConstitutionStatus";

export const ConstituionalCommitteeDetailPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const isDataLoading =
    committeeDetailQuery.isLoading || constitutionListQuery.isLoading;

  const convertIpfsUrl = (url: string): string => {
    if (url.startsWith("ipfs://")) {
      const hash = url.replace("ipfs://", "");
      return `https://ipfs.io/ipfs/${hash}`;
    }
    return url;
  };

  const handleFullTextClick = async (url: string) => {
    setIsLoading(true);
    setIsModalOpen(true);

    try {
      const fetchUrl = convertIpfsUrl(url);
      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.text();

      try {
        const jsonData = JSON.parse(data);
        setModalContent(JSON.stringify(jsonData, null, 2));
      } catch {
        setModalContent(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setModalContent(
        `Failed to fetch content from URL:\n\n${url}\n\nError: ${errorMessage}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        {isDataLoading ? (
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
          <Modal onClose={() => setIsModalOpen(false)} maxWidth='900px'>
            <div className='p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  Constitution Full Text
                </h3>
              </div>
              {isLoading ? (
                <div className='flex flex-col gap-3'>
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                </div>
              ) : (
                <div className='max-h-[70vh] overflow-auto rounded-lg text-sm'>
                  <div
                    className='prose prose-sm max-w-none dark:prose-invert'
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
