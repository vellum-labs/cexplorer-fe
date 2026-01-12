import { type FC, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { FileText, TriangleAlert, FileUser } from "lucide-react";
import {
  VoteBadge,
  formatString,
  Button,
  JsonDisplay,
  LoadingSkeleton,
} from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { Tooltip, Modal, SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import type { AnchorInfo } from "@/types/governanceTypes";
import { useFetchUrlContent } from "@/hooks/useFetchUrlContent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/constants/markdows";
import { toMarkdown } from "@/utils/toMarkdown";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface VoteCellProps {
  vote?: Vote | string;
  txHash?: string;
  proposalId?: string;
  isLate?: boolean;
  anchorInfo?: AnchorInfo;
}

export const VoteCell: FC<VoteCellProps> = ({
  vote,
  txHash,
  proposalId,
  isLate = false,
  anchorInfo,
}) => {
  const { t } = useAppTranslation();
  const {
    content: modalContent,
    isLoading,
    isOpen: isModalOpen,
    fetchContent,
    close: closeModal,
  } = useFetchUrlContent();
  const { content: fullMetadata, fetchContent: fetchFullMetadata } =
    useFetchUrlContent();
  const [showFullMetadata, setShowFullMetadata] = useState(false);
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  if (!vote) {
    return "-";
  }

  const hasAnchorInfo =
    anchorInfo?.offchain?.comment || anchorInfo?.url ? true : false;

  const handleAnchorClick = async () => {
    if (!anchorInfo) return;

    setShowFullMetadata(false);

    if (anchorInfo.url) {
      await fetchContent(anchorInfo.url);
      await fetchFullMetadata(anchorInfo.url);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      <button
        onClick={handleAnchorClick}
        disabled={!hasAnchorInfo}
        className={`${
          hasAnchorInfo
            ? "cursor-pointer text-primary hover:opacity-80"
            : "cursor-not-allowed text-grayTextSecondary opacity-50"
        }`}
        title={
          hasAnchorInfo ? t("governance.vote.viewAnchorInfo") : t("governance.vote.noAnchorInfo")
        }
      >
        <FileUser size={16} />
      </button>

      {txHash && (
        <Link
          to='/gov/vote/$hash'
          params={{ hash: txHash }}
          search={{ tab: proposalId }}
          className='text-muted-foreground text-primary'
          title={t("governance.vote.openVoteDetail")}
        >
          <FileText size={16} />
        </Link>
      )}
      <VoteBadge vote={vote as Vote} />
      {isLate && (
        <Tooltip content={t("governance.vote.lateVoteWarning")}>
          <TriangleAlert size={16} className='text-yellow-500' />
        </Tooltip>
      )}

      {isModalOpen &&
        !clickedUrl &&
        createPortal(
          <Modal onClose={closeModal} maxWidth='800px'>
            <div className='p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{t("governance.vote.metadata")}</h3>
                {txHash && (
                  <Link
                    to='/gov/vote/$hash'
                    params={{ hash: txHash }}
                    search={{ tab: proposalId }}
                    className='text-sm text-primary hover:opacity-80'
                  >
                    <span className='mr-1'>{t("governance.vote.voteLabel")}</span>
                    <span className='font-mono'>
                      {formatString(txHash, "long")}
                    </span>
                  </Link>
                )}
              </div>
              {isLoading ? (
                <div className='flex flex-col gap-3'>
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                  <LoadingSkeleton height='24px' rounded='sm' />
                </div>
              ) : (
                <>
                  <div className='rounded-lg text-sm max-h-[500px] overflow-auto'>
                    {showFullMetadata && fullMetadata ? (
                      <JsonDisplay
                        data={JSON.parse(fullMetadata)}
                        isLoading={false}
                        isError={false}
                        noDataLabel={t("common:sdk.jsonDisplay.noDataLabel")}
                      />
                    ) : (
                      <div
                        className='text-sm'
                        style={{
                          fontSize: "var(--font-size-text-sm)",
                          lineHeight: "var(--line-height-text-sm)",
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents(setClickedUrl)}
                        >
                          {toMarkdown(modalContent)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {fullMetadata && (
                    <div className='mt-3'>
                      <Button
                        size='sm'
                        variant='primary'
                        label={
                          showFullMetadata
                            ? t("governance.vote.showSummary")
                            : t("governance.vote.showFullMetadata")
                        }
                        onClick={() => setShowFullMetadata(!showFullMetadata)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </Modal>,
          document.body,
        )}
      {clickedUrl && (
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => {
            setClickedUrl(null);
          }}
          warningText={t("common:sdk.safetyLink.warningText")}
          goBackLabel={t("common:sdk.safetyLink.goBackLabel")}
          visitLabel={t("common:sdk.safetyLink.visitLabel")}
        />
      )}
    </div>
  );
};
