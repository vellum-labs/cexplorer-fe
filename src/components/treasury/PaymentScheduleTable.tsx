import type { FC } from "react";
import { useMemo, useState } from "react";
import type { Milestone, VendorContractEvent } from "@/services/vendorContracts";
import {
  GlobalTable,
  formatNumberWithSuffix,
  formatString,
  formatDate,
  useThemeStore,
  SafetyLinkModal,
  Copy,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { ChevronDown, FileText, ExternalLink } from "lucide-react";
import { milestoneStatusConfig, eventConfig } from "@/constants/treasuryStyles";

export interface AggregatedMilestone {
  milestone_id: string;
  milestone_order: number;
  status: Milestone["status"];
  acceptance_criteria: string | null;
  amount_ada: number | null;
  completion: Milestone["completion"];
  disbursement: string | null;
  project: Milestone["project"];
  completeTx: { tx_hash: string; block_time: number } | null;
  withdrawTx: { tx_hash: string; block_time: number } | null;
}

interface PaymentScheduleTableProps {
  milestones: Milestone[];
  events: VendorContractEvent[];
  initialAmountAda?: number;
  query: any;
  labels: {
    title: string;
    columns: {
      milestone: string;
      status: string;
      evidence: string;
      amount: string;
      transaction: string;
    };
    noMilestones: string;
    totalBudget: string;
    evidenceStatus: {
      submitted: string;
      notSubmitted: string;
    };
    statusLabels: {
      pending: string;
      completed: string;
      withdrawn: string;
    };
    eventLabels: {
      complete: string;
      withdraw: string;
    };
    expandedDetails: {
      acceptanceCriteria: string;
      evidenceSubmissions: string;
      open: string;
      noCriteria: string;
      noEvidence: string;
    };
    safetyLink: {
      warningText: string;
      goBackLabel: string;
      visitLabel: string;
    };
  };
}

export const PaymentScheduleTable: FC<PaymentScheduleTableProps> = ({
  milestones,
  events,
  initialAmountAda,
  query,
  labels,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  // Aggregate milestones with events data
  const aggregatedMilestones = useMemo(() => {
    return milestones.map((m): AggregatedMilestone => {
      // Find complete event for this milestone
      const completeEvent = events.find(
        e =>
          e.event_type === "complete" &&
          e.milestone?.milestone_id === m.milestone_id,
      );

      // Find withdraw event — check metadata_raw for milestone key
      const withdrawEvent = events.find(e => {
        if (e.event_type !== "withdraw") return false;
        const metaMilestones = (e.metadata_raw as any)?.body?.milestones;
        if (
          metaMilestones &&
          typeof metaMilestones === "object" &&
          !Array.isArray(metaMilestones)
        ) {
          return Object.keys(metaMilestones)[0] === m.milestone_id;
        }
        return false;
      });

      return {
        milestone_id: m.milestone_id,
        milestone_order: m.milestone_order,
        status: m.status,
        acceptance_criteria: m.acceptance_criteria,
        amount_ada: m.amount_ada,
        completion: m.completion,
        disbursement: m.disbursement,
        project: m.project,
        completeTx: completeEvent
          ? { tx_hash: completeEvent.tx_hash, block_time: completeEvent.block_time }
          : null,
        withdrawTx: withdrawEvent
          ? { tx_hash: withdrawEvent.tx_hash, block_time: withdrawEvent.block_time }
          : null,
      };
    });
  }, [milestones, events]);

  const getStatusBadge = (status: Milestone["status"]) => {
    const cfg = milestoneStatusConfig[status] || milestoneStatusConfig.pending;
    const StatusIcon = cfg.icon;

    return (
      <div
        className={`flex w-fit items-center gap-1 rounded-m border px-2 py-0.5 ${
          isDark ? cfg.bgDark : cfg.bgLight
        } ${isDark ? cfg.borderDark : cfg.borderLight}`}
      >
        <StatusIcon size={14} className={cfg.iconColor} />
        <span
          className={`text-text-xs font-medium ${isDark ? cfg.textDark : cfg.textLight}`}
        >
          {labels.statusLabels[status]}
        </span>
      </div>
    );
  };

  const getEventBadge = (type: "complete" | "withdraw") => {
    const config = eventConfig[type];
    const Icon = config.icon;

    return (
      <div
        className={`flex w-fit items-center gap-1/2 rounded-m border px-1 py-0.5 ${
          isDark ? config.bgDark : config.bgLight
        } ${isDark ? config.borderDark : config.borderLight}`}
      >
        <Icon size={12} className={config.iconColor} />
        <span className='text-text-xs font-medium text-text'>
          {labels.eventLabels[type]}
        </span>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "milestone",
        title: labels.columns.milestone,
        visible: true,
        widthPx: 100,
        render: (item: Record<string, any>) => (
          <span className='font-medium'>{item.milestone_id}</span>
        ),
      },
      {
        key: "status",
        title: labels.columns.status,
        visible: true,
        widthPx: 130,
        render: (item: Record<string, any>) =>
          getStatusBadge(item.status as Milestone["status"]),
      },
      {
        key: "evidence",
        title: labels.columns.evidence,
        visible: true,
        widthPx: 120,
        render: (item: Record<string, any>) => {
          const hasEvidence =
            (item.completion?.evidence?.length ?? 0) > 0;
          return (
            <span
              className={`text-text-sm ${
                hasEvidence ? "text-[#17B26A]" : "text-grayTextSecondary"
              }`}
            >
              {hasEvidence
                ? labels.evidenceStatus.submitted
                : labels.evidenceStatus.notSubmitted}
            </span>
          );
        },
      },
      {
        key: "transaction",
        title: labels.columns.transaction,
        visible: true,
        widthPx: 280,
        render: (item: Record<string, any>) => {
          const row = item as AggregatedMilestone;
          if (!row.completeTx && !row.withdrawTx) return <span>-</span>;

          return (
            <div className='flex flex-col gap-1'>
              {row.completeTx && (
                <div className='flex items-center gap-1'>
                  {getEventBadge("complete")}
                  <Link
                    to='/tx/$hash'
                    params={{ hash: row.completeTx.tx_hash }}
                    className='text-text-xs text-primary'
                  >
                    {formatString(row.completeTx.tx_hash, "short")}
                  </Link>
                  <Copy copyText={row.completeTx.tx_hash} size={12} />
                </div>
              )}
              {row.withdrawTx && (
                <div className='flex items-center gap-1'>
                  {getEventBadge("withdraw")}
                  <Link
                    to='/tx/$hash'
                    params={{ hash: row.withdrawTx.tx_hash }}
                    className='text-text-xs text-primary'
                  >
                    {formatString(row.withdrawTx.tx_hash, "short")}
                  </Link>
                  <Copy copyText={row.withdrawTx.tx_hash} size={12} />
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "amount",
        title: labels.columns.amount,
        visible: true,
        widthPx: 120,
        render: (item: Record<string, any>) => (
          <span className='font-medium'>
            {item.amount_ada != null
              ? `₳${formatNumberWithSuffix(item.amount_ada)}`
              : "-"}
          </span>
        ),
      },
      {
        key: "toggle",
        title: "",
        visible: true,
        widthPx: 50,
        toggleCell: true,
        render: (_item: Record<string, any>, toggle?: () => void) => (
          <button
            onClick={toggle}
            className='flex h-8 w-8 items-center justify-center rounded-m hover:bg-border'
          >
            <ChevronDown size={18} className='text-grayTextPrimary' />
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, isDark],
  );

  const renderExtraContent = (item: Record<string, any>) => {
    const row = item as AggregatedMilestone;
    const evidence = row.completion?.evidence || [];

    return (
      <div className='grid grid-cols-1 gap-2 bg-darker p-4 md:grid-cols-2'>
        <div className='rounded-l border border-border bg-cardBg p-3'>
          <h4 className='mb-1 text-text-sm font-semibold text-text'>
            {labels.expandedDetails.acceptanceCriteria}
          </h4>
          <p className='text-text-sm text-grayTextPrimary'>
            {row.acceptance_criteria || labels.expandedDetails.noCriteria}
          </p>
        </div>

        <div className='rounded-l border border-border bg-cardBg p-3'>
          <h4 className='mb-1 text-text-sm font-semibold text-text'>
            {labels.expandedDetails.evidenceSubmissions}
          </h4>
          {evidence.length > 0 ? (
            <div className='flex flex-col gap-2'>
              {evidence.map((ev, idx) => (
                <div key={idx} className='flex items-start gap-2'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-m bg-border'>
                    <FileText size={20} className='text-grayTextPrimary' />
                  </div>
                  <div className='flex flex-1 flex-col gap-0.5'>
                    <div className='flex items-center justify-between'>
                      <span className='text-text-sm font-medium text-text'>
                        {ev.label || row.project.project_name}
                      </span>
                      {ev.anchorUrl?.length > 0 && (
                        <button
                          onClick={() =>
                            setClickedUrl(ev.anchorUrl.join(""))
                          }
                          className='flex items-center gap-1 text-text-sm font-medium text-primary'
                        >
                          {labels.expandedDetails.open}
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                    <div className='flex items-center gap-2 text-text-xs text-grayTextSecondary'>
                      {row.completion?.time && (
                        <span>
                          {formatDate(row.completion.time * 1000)}
                        </span>
                      )}
                      {row.completion?.tx_hash && (
                        <Link
                          to='/tx/$hash'
                          params={{ hash: row.completion.tx_hash }}
                          className='text-primary'
                        >
                          {formatString(row.completion.tx_hash, "short")}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-text-sm text-grayTextSecondary'>
              {labels.expandedDetails.noEvidence}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='rounded-l border border-border bg-cardBg p-2'>
        <h2 className='mb-2 text-text-md font-medium'>{labels.title}</h2>

        <GlobalTable
          type='default'
          scrollable
          totalItems={aggregatedMilestones.length}
          minContentWidth={700}
          query={query}
          items={aggregatedMilestones}
          columns={columns}
          noItemsLabel={labels.noMilestones}
          expand={{
            extraContent: renderExtraContent,
            toggleKey: (item: Record<string, any>) => item.milestone_id,
            expandedRows,
            setExpandedRows,
          }}
        />

        {initialAmountAda != null && aggregatedMilestones.length > 0 && (
          <div className='rounded-b-l bg-darker px-3 py-2 text-right'>
            <span className='text-text-sm font-semibold text-text'>
              {labels.totalBudget}: ₳{formatNumberWithSuffix(initialAmountAda)}
            </span>
          </div>
        )}
      </div>
      {clickedUrl && (
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => setClickedUrl(null)}
          warningText={labels.safetyLink.warningText}
          goBackLabel={labels.safetyLink.goBackLabel}
          visitLabel={labels.safetyLink.visitLabel}
        />
      )}
    </>
  );
};
