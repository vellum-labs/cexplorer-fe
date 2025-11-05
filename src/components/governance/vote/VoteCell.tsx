import { type FC, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { FileText, TriangleAlert, FileUser } from "lucide-react";
import { VoteBadge, formatString } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { Tooltip, Modal } from "@vellumlabs/cexplorer-sdk";
import type { AnchorInfo } from "@/types/governanceTypes";

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

  const handleAnchorClick = async () => {
    if (anchorInfo?.offchain?.comment) {
      setModalContent(anchorInfo.offchain.comment);
      setShowFullMetadata(false);
      setIsModalOpen(true);

      if (anchorInfo?.url) {
        try {
          const fetchUrl = convertIpfsUrl(anchorInfo.url);
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
      } else {
        setFullMetadata("");
      }
    } else if (anchorInfo?.url) {
      setIsLoading(true);
      setIsModalOpen(true);
      setShowFullMetadata(false);
      try {
        const fetchUrl = convertIpfsUrl(anchorInfo.url);
        const response = await fetch(fetchUrl);
        const data = await response.text();

        try {
          const jsonData = JSON.parse(data);
          const comment = jsonData?.body?.comment;
          const rationaleStatement = jsonData?.body?.rationaleStatement;
          const rationale = jsonData?.body?.rationale;

          let extractedContent = "";

          if (comment && rationaleStatement) {
            extractedContent = `Comment:\n${comment}\n\nRationale Statement:\n${rationaleStatement}`;
          } else if (comment && rationale) {
            extractedContent = `Comment:\n${comment}\n\nRationale:\n${rationale}`;
          } else if (rationaleStatement && rationale) {
            extractedContent = `Rationale Statement:\n${rationaleStatement}\n\nRationale:\n${rationale}`;
          } else if (comment) {
            extractedContent = comment;
          } else if (rationaleStatement) {
            extractedContent = rationaleStatement;
          } else if (rationale) {
            extractedContent = rationale;
          }

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
      } catch (error) {
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
                <p className='text-grayTextPrimary'>Loading...</p>
              ) : (
                <>
                  <div className='rounded-lg text-sm max-h-[500px] overflow-auto whitespace-pre-wrap break-words p-3'>
                    {showFullMetadata && fullMetadata
                      ? fullMetadata
                      : modalContent}
                  </div>
                  {fullMetadata && (
                    <button
                      onClick={() => setShowFullMetadata(!showFullMetadata)}
                      className='text-sm mt-3 rounded-m bg-primary px-3 py-1.5 text-white hover:opacity-90'
                    >
                      {showFullMetadata ? "Show Summary" : "Show Full Metadata"}
                    </button>
                  )}
                </>
              )}
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
};
