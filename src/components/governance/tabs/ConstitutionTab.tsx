import type { FC } from "react";
import type { ConstitutionDataItem } from "@/types/governanceTypes";
import type { TableColumns } from "@/types/tableTypes";

import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { useFetchConstitutionList } from "@/services/governance";
import { useFetchUrlContent } from "@/hooks/useFetchUrlContent";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getConstitutionStatus } from "@/utils/getConstitutionStatus";

interface ConstitutionTabProps {
  currentEpoch: number;
}

export const ConstitutionTab: FC<ConstitutionTabProps> = ({ currentEpoch }) => {
  const {
    content: modalContent,
    isLoading,
    isOpen: isModalOpen,
    fetchContent: handleFullTextClick,
    close: closeModal,
  } = useFetchUrlContent();
  const constitutionListQuery = useFetchConstitutionList();

  const items = constitutionListQuery.data?.data?.data ?? [];
  const totalItems = constitutionListQuery.data?.data?.count ?? 0;

  const columns: TableColumns<ConstitutionDataItem & { index: number }> = [
    {
      key: "row_number",
      render: item => (
        <span className='text-grayTextPrimary'>{item.index + 1}</span>
      ),
      title: "#",
      visible: true,
      widthPx: 40,
    },
    {
      key: "status",
      render: item => {
        const status = getConstitutionStatus(item, items, currentEpoch);
        const colorMap = {
          current: "bg-greenText",
          draft: "bg-yellowText",
          past: "bg-redText",
        };
        const labelMap = {
          current: "Current constitution",
          draft: "Draft",
          past: "Past constitution",
        };
        return (
          <div className='flex h-[24px] w-fit items-center gap-[6px] rounded-m border border-border px-1.5'>
            <PulseDot
              color={colorMap[status]}
              animate={status === "current"}
              size={2}
            />
            <span className='text-text-xs font-medium'>{labelMap[status]}</span>
          </div>
        );
      },
      title: "Status",
      visible: true,
      widthPx: 150,
    },
    {
      key: "governance_action",
      render: item => {
        if (!item?.gov_action_proposal) {
          return (
            <div className='flex flex-col'>
              <span className='text-primary'>Genesis Constitution</span>
              <div className='flex items-center gap-1'>
                <span className='text-textSecondary text-text-xs'>
                  {formatString(item.script_hash, "long")}
                </span>
                <Copy copyText={item.script_hash} size={10} />
              </div>
            </div>
          );
        }

        const txId = item.gov_action_proposal.description?.contents?.[0]?.txId;

        return (
          <div className='flex flex-col'>
            <Link
              to='/tx/$hash'
              params={{ hash: txId ?? "" }}
              className='text-primary'
            >
              {item.gov_action_proposal.type}
            </Link>
            <div className='flex items-center gap-1'>
              <span className='text-textSecondary text-text-xs'>
                {formatString(txId ?? item.script_hash, "long")}
              </span>
              <Copy copyText={txId ?? item.script_hash} size={10} />
            </div>
          </div>
        );
      },
      jsonFormat: item =>
        item?.gov_action_proposal?.description?.contents?.[0]?.txId ??
        item?.script_hash ??
        "-",
      title: "Governance action",
      visible: true,
      widthPx: 220,
    },
    {
      key: "content",
      render: item => {
        if (!item?.anchor?.url) {
          return "-";
        }

        return (
          <button
            onClick={() => handleFullTextClick(item.anchor.url)}
            className='flex items-center gap-1 text-primary hover:opacity-80'
          >
            <FileText size={14} />
            <span>Full text</span>
          </button>
        );
      },
      title: "Content",
      visible: true,
      widthPx: 100,
    },
    {
      key: "ratified_epoch",
      render: item => {
        const ratifiedEpoch = item?.gov_action_proposal?.ratified_epoch;
        if (!ratifiedEpoch) {
          return "-";
        }

        return (
          <div className='flex flex-col'>
            <div className='flex items-center gap-1/2'>
              <span className='text-grayTextPrimary'>Epoch</span>
              <EpochCell no={ratifiedEpoch} />
            </div>
          </div>
        );
      },
      jsonFormat: item => item?.gov_action_proposal?.ratified_epoch ?? "-",
      title: "Ratified epoch",
      visible: true,
      widthPx: 120,
    },
    {
      key: "enacted_epoch",
      render: item => {
        const enactedEpoch = item?.gov_action_proposal?.enacted_epoch;
        if (!enactedEpoch) {
          return "-";
        }

        return (
          <div className='flex flex-col'>
            <div className='flex items-center gap-1/2'>
              <span className='text-grayTextPrimary'>Epoch</span>
              <EpochCell no={enactedEpoch} />
            </div>
          </div>
        );
      },
      jsonFormat: item => item?.gov_action_proposal?.enacted_epoch ?? "-",
      title: "Enacted epoch",
      visible: true,
      widthPx: 120,
    },
  ];

  const itemsWithIndex = items.map((item, index) => ({ ...item, index }));

  return (
    <>
      <div className='mt-2'>
        <GlobalTable
          type='default'
          totalItems={totalItems}
          itemsPerPage={10}
          rowHeight={60}
          minContentWidth={750}
          scrollable
          pagination={false}
          query={constitutionListQuery}
          items={itemsWithIndex}
          columns={columns}
        />
      </div>
      {isModalOpen &&
        createPortal(
          <Modal onClose={closeModal} maxWidth='900px'>
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
    </>
  );
};
