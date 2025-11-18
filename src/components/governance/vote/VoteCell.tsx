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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/constants/markdows";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [fullMetadata, setFullMetadata] = useState<string>("");
  const [showFullMetadata, setShowFullMetadata] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  if (!vote) {
    return "-";
  }

  const hasAnchorInfo =
    anchorInfo?.offchain?.comment || anchorInfo?.url ? true : false;

  const convertIpfsUrl = (url: string): string => {
    if (url.startsWith("ipfs://")) {
      const hash = url.replace("ipfs://", "");
      return `https://ipfs.io/ipfs/${hash}`;
    }
    return url;
  };

  const fetchFullMetadata = async (url: string) => {
    try {
      const fetchUrl = convertIpfsUrl(url);
      const response = await fetch(fetchUrl);
      const data = await response.text();

      try {
        const jsonData = JSON.parse(data);
        setFullMetadata(JSON.stringify(jsonData, null, 2));
      } catch {
        setFullMetadata(data);
      }
    } catch {
      setFullMetadata("");
    }
  };

  const extractContentFromJson = (jsonData: any): string => {
    const comment = jsonData?.body?.comment;
    const rationaleStatement = jsonData?.body?.rationaleStatement;
    const rationale = jsonData?.body?.rationale;

    const parts: string[] = [];

    if (comment) parts.push(`Comment:\n${comment}`);
    if (rationaleStatement)
      parts.push(`Rationale Statement:\n${rationaleStatement}`);
    if (rationale) parts.push(`Rationale:\n${rationale}`);

    return parts.join("\n\n");
  };

  const handleAnchorClick = async () => {
    if (!anchorInfo) return;

    if (anchorInfo.offchain?.comment) {
      setModalContent(anchorInfo.offchain.comment);
      setShowFullMetadata(false);
      setIsModalOpen(true);

      if (anchorInfo.url) {
        await fetchFullMetadata(anchorInfo.url);
      } else {
        setFullMetadata("");
      }
      return;
    }

    if (anchorInfo.url) {
      setIsLoading(true);
      setIsModalOpen(true);
      setShowFullMetadata(false);

      try {
        const fetchUrl = convertIpfsUrl(anchorInfo.url);
        const response = await fetch(fetchUrl);
        const data = await response.text();

        try {
          const jsonData = JSON.parse(data);
          const extractedContent = extractContentFromJson(jsonData);

          if (extractedContent) {
            setModalContent(extractedContent);
            setFullMetadata(JSON.stringify(jsonData, null, 2));
          } else {
            setModalContent(JSON.stringify(jsonData, null, 2));
            setFullMetadata("");
          }
        } catch {
          setModalContent(data);
          setFullMetadata("");
        }
      } catch {
        setModalContent("Failed to fetch content from URL");
        setFullMetadata("");
      } finally {
        setIsLoading(false);
      }
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
          hasAnchorInfo ? "View anchor information" : "No anchor information"
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
          title='Open vote detail'
        >
          <FileText size={16} />
        </Link>
      )}
      <VoteBadge vote={vote as Vote} />
      {isLate && (
        <Tooltip content='This vote was submitted after voting closed'>
          <TriangleAlert size={16} className='text-yellow-500' />
        </Tooltip>
      )}

      {isModalOpen &&
        createPortal(
          <Modal onClose={() => setIsModalOpen(false)} maxWidth='800px'>
            <div className='p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Metadata</h3>
                {txHash && (
                  <Link
                    to='/gov/vote/$hash'
                    params={{ hash: txHash }}
                    search={{ tab: proposalId }}
                    className='text-sm text-primary hover:opacity-80'
                  >
                    <span className='mr-1'>Vote:</span>
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
                  <div className='rounded-lg text-sm max-h-[500px] overflow-auto p-3'>
                    {showFullMetadata && fullMetadata ? (
                      (() => {
                        try {
                          return (
                            <JsonDisplay
                              data={JSON.parse(fullMetadata)}
                              isLoading={false}
                              isError={false}
                            />
                          );
                        } catch {
                          return (
                            <pre className='whitespace-pre-wrap break-words'>
                              {fullMetadata}
                            </pre>
                          );
                        }
                      })()
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents(setClickedUrl)}
                      >
                        {modalContent}
                      </ReactMarkdown>
                    )}
                  </div>
                  {fullMetadata && (
                    <div className='mt-3'>
                      <Button
                        size='sm'
                        variant='primary'
                        label={
                          showFullMetadata
                            ? "Show Summary"
                            : "Show Full Metadata"
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
        <SafetyLinkModal url={clickedUrl} onClose={() => setClickedUrl(null)} />
      )}
    </div>
  );
};
