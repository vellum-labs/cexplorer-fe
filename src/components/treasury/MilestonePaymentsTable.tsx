import type { FC } from "react";
import { useMemo, useState } from "react";
import {
  useFetchVendorContractEventsInfinite,
  type VendorContractEvent,
  type Milestone,
} from "@/services/vendorContracts";
import {
  GlobalTable,
  formatNumberWithSuffix,
  formatString,
  formatDate,
  useThemeStore,
  TableSettingsDropdown,
  SafetyLinkModal,
} from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { ChevronDown, FileText, ExternalLink } from "lucide-react";
import { useMilestonePaymentsTableStore } from "@/stores/tables/milestonePaymentsTableStore";
import type { MilestonePaymentsColumns } from "@/types/tableTypes";
import { eventConfig } from "@/constants/treasuryStyles";
import { milestonePaymentsTableOptions } from "@/constants/tables/milestonePaymentsTableOptions";

interface MilestonePaymentsTableProps {
  projectId: string;
  milestones: Milestone[];
  initialAmountAda?: number;
  labels: {
    title: string;
    columns: {
      milestone: string;
      event: string;
      amount: string;
      transaction: string;
      date: string;
    };
    noPayments: string;
    rowsLabel: string;
    eventTypes: {
      initialize: string;
      withdraw: string;
      resume: string;
      disburse: string;
      publish: string;
      complete: string;
      pause: string;
      fund: string;
    };
    expandedDetails: {
      milestoneCriteria: string;
      evidenceSubmission: string;
      open: string;
      noCriteria: string;
      noEvidence: string;
    };
    safetyLink: {
      warningText: string;
      goBackLabel: string;
      visitLabel: string;
    };
    displayingText: (count: number, total: number) => string;
  };
}

export const MilestonePaymentsTable: FC<MilestonePaymentsTableProps> = ({
  projectId,
  milestones,
  initialAmountAda,
  labels,
}) => {
  const { theme } = useThemeStore();
  const searchParams = useSearch({ from: "/treasury/contracts/$id" });
  const page = (searchParams as { page?: number }).page || 1;

  const {
    columnsVisibility,
    setColumnVisibility,
    rows,
    setRows,
    columnsOrder,
    setColumnsOrder,
  } = useMilestonePaymentsTableStore()();

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  const query = useFetchVendorContractEventsInfinite({
    projectId,
    page,
    limit: rows,
  });

  const events = query.data?.pages.flatMap(p => p.data) || [];
  const totalCount = query.data?.pages[0]?.pagination?.total_count || 0;

  const getEventBadge = (eventType: VendorContractEvent["event_type"]) => {
    const config = eventConfig[eventType];
    const Icon = config.icon;
    const isDark = theme === "dark";

    return (
      <div
        className={`flex w-fit items-center gap-1/2 rounded-m border px-1 py-0.5 ${
          isDark ? config.bgDark : config.bgLight
        } ${isDark ? config.borderDark : config.borderLight}`}
      >
        <Icon size={14} className={config.iconColor} />
        <span className='text-text-xs font-medium text-text'>
          {labels.eventTypes[eventType]}
        </span>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "milestone",
        title: labels.columns.milestone,
        visible: columnsVisibility.milestone,
        widthPx: 100,
        render: (item: VendorContractEvent) => {
          const ms = item.milestone ?? (() => {
            const found = findMilestone(item);
            return found ? { milestone_id: found.milestone_id } : null;
          })();
          return (
            <span className='font-medium'>
              {ms ? ms.milestone_id : "-"}
            </span>
          );
        },
      },
      {
        key: "event",
        title: labels.columns.event,
        visible: columnsVisibility.event,
        widthPx: 130,
        render: (item: VendorContractEvent) => getEventBadge(item.event_type),
      },
      {
        key: "amount",
        title: labels.columns.amount,
        visible: columnsVisibility.amount,
        widthPx: 120,
        render: (item: VendorContractEvent) => {
          const amount = item.amount_ada
            ?? findMilestone(item)?.amount_ada
            ?? (item.event_type === "fund" ? initialAmountAda : null)
            ?? null;
          return (
            <span className='font-medium'>
              {amount != null ? `₳${formatNumberWithSuffix(amount)}` : "-"}
            </span>
          );
        },
      },
      {
        key: "transaction",
        title: labels.columns.transaction,
        visible: columnsVisibility.transaction,
        widthPx: 200,
        render: (item: VendorContractEvent) => (
          <Link
            to='/tx/$hash'
            params={{ hash: item.tx_hash }}
            className='text-primary'
          >
            {formatString(item.tx_hash, "long")}
          </Link>
        ),
      },
      {
        key: "date",
        title: labels.columns.date,
        visible: columnsVisibility.date,
        widthPx: 150,
        render: (item: VendorContractEvent) =>
          item.block_time ? formatDate(item.block_time * 1000) : <span>-</span>,
      },
      {
        key: "toggle",
        title: "",
        visible: true,
        widthPx: 50,
        toggleCell: true,
        render: (_item: VendorContractEvent, toggle?: () => void) => (
          <button
            onClick={toggle}
            className='flex h-8 w-8 items-center justify-center rounded-m hover:bg-border'
          >
            <ChevronDown size={18} className='text-grayTextPrimary' />
          </button>
        ),
      },
    ],
    [labels, theme, columnsVisibility],
  );

  const findMilestone = (event: VendorContractEvent) => {
    if (event.milestone) {
      return milestones.find(
        m => m.milestone_order === event.milestone!.milestone_order,
      );
    }
    // For withdraw events, milestone info is only in metadata_raw
    const metaMilestones = (event.metadata_raw as any)?.body?.milestones;
    if (metaMilestones && typeof metaMilestones === "object" && !Array.isArray(metaMilestones)) {
      const milestoneId = Object.keys(metaMilestones)[0];
      if (milestoneId) {
        return milestones.find(m => m.milestone_id === milestoneId);
      }
    }
    return null;
  };

  const renderExtraContent = (item: VendorContractEvent) => {
    const milestone = findMilestone(item);
    const evidence = milestone?.completion?.evidence || [];

    return (
      <div className='grid grid-cols-1 gap-2 bg-darker p-4 md:grid-cols-2'>
        <div className='rounded-l border border-border bg-cardBg p-3'>
          <h4 className='mb-1 text-text-sm font-semibold text-text'>
            {labels.expandedDetails.milestoneCriteria}
          </h4>
          <p className='text-text-sm text-grayTextPrimary'>
            {milestone?.acceptance_criteria || labels.expandedDetails.noCriteria}
          </p>
        </div>

        <div className='rounded-l border border-border bg-cardBg p-3'>
          <h4 className='mb-1 text-text-sm font-semibold text-text'>
            {labels.expandedDetails.evidenceSubmission}
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
                        {ev.label || item.project.project_name}
                      </span>
                      {ev.anchorUrl?.length > 0 && (
                        <button
                          onClick={() => setClickedUrl(ev.anchorUrl.join(''))}
                          className='flex items-center gap-1 text-text-sm font-medium text-primary'
                        >
                          {labels.expandedDetails.open}
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                    <div className='flex items-center gap-2 text-text-xs text-grayTextSecondary'>
                      {milestone?.completion?.time && (
                        <span>
                          {new Date(
                            milestone.completion.time * 1000,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "UTC",
                          })}{" "}
                          (UTC)
                        </span>
                      )}
                      {milestone?.completion?.tx_hash && (
                        <Link
                          to='/tx/$hash'
                          params={{ hash: milestone.completion.tx_hash }}
                          className='text-primary'
                        >
                          {formatString(milestone.completion.tx_hash, "short")}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex items-start gap-2'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-m bg-border'>
                <FileText size={20} className='text-grayTextPrimary' />
              </div>
              <div className='flex flex-1 flex-col gap-0.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-text-sm font-medium text-text'>
                    {item.milestone
                      ? `${item.project.project_name}`
                      : item.project.project_name}
                  </span>
                  <Link
                    to='/tx/$hash'
                    params={{ hash: item.tx_hash }}
                    className='text-text-sm font-medium text-primary'
                  >
                    {labels.expandedDetails.open}
                  </Link>
                </div>
                <div className='flex items-center gap-2 text-text-xs text-grayTextSecondary'>
                  {item.block_time && (
                    <span>
                      {new Date(
                        item.block_time * 1000,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      })}{" "}
                      (UTC)
                    </span>
                  )}
                  <Link
                    to='/tx/$hash'
                    params={{ hash: item.tx_hash }}
                    className='text-primary'
                  >
                    {formatString(item.tx_hash, "short")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
    <div className='rounded-l border border-border bg-cardBg p-2'>
      <div className='mb-2 flex w-full items-center'>
        <h2 className='text-text-md font-medium'>{labels.title}</h2>
        <div className='ml-auto flex items-center'>
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            rowsLabel={labels.rowsLabel}
            columnsOptions={milestonePaymentsTableOptions.map(item => ({
              label: labels.columns[item.key],
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            }))}
          />
        </div>
      </div>

      <GlobalTable
        type='infinite'
        currentPage={page}
        totalItems={totalCount}
        itemsPerPage={rows}
        scrollable
        query={query}
        minContentWidth={700}
        items={events}
        columns={columns.sort((a, b) => {
          if (a.key === "toggle") return 1;
          if (b.key === "toggle") return -1;
          return (
            columnsOrder.indexOf(a.key as keyof MilestonePaymentsColumns) -
            columnsOrder.indexOf(b.key as keyof MilestonePaymentsColumns)
          );
        })}
        onOrderChange={setColumnsOrder}
        renderDisplayText={labels.displayingText}
        noItemsLabel={labels.noPayments}
        expand={{
          extraContent: renderExtraContent,
          toggleKey: (item: VendorContractEvent) => item.tx_hash,
          expandedRows,
          setExpandedRows,
        }}
      />
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
