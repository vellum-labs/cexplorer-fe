import type { FC } from "react";
import { useMemo } from "react";
import {
  useFetchVendorContractEventsInfinite,
  type VendorContractEvent,
} from "@/services/vendorContracts";
import {
  GlobalTable,
  formatNumber,
  formatString,
  formatDate,
  useThemeStore,
  TableSettingsDropdown,
} from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowDownCircle,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Wallet,
  Send,
  Upload,
  Zap,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useMilestonePaymentsTableStore } from "@/stores/tables/milestonePaymentsTableStore";
import type { MilestonePaymentsColumns } from "@/types/tableTypes";

interface MilestonePaymentsTableProps {
  projectId: string;
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
      description: string;
      evidenceSubmission: string;
      open: string;
    };
    displayingText: (count: number, total: number) => string;
  };
}

const milestonePaymentsTableOptions: { key: keyof MilestonePaymentsColumns }[] = [
  { key: "milestone" },
  { key: "amount" },
  { key: "transaction" },
  { key: "date" },
  { key: "event" },
];

const eventConfig = {
  initialize: {
    icon: Zap,
    iconColor: "text-[#7C3AED]",
    bgLight: "bg-[#F5F3FF]",
    bgDark: "bg-[#2D1F5E]",
    borderLight: "border-[#DDD6FE]",
    borderDark: "border-[#5B21B6]",
  },
  withdraw: {
    icon: ArrowDownCircle,
    iconColor: "text-[#1296DB]",
    bgLight: "bg-[#EBF5FF]",
    bgDark: "bg-[#0A2540]",
    borderLight: "border-[#B2DDFF]",
    borderDark: "border-[#1F4C73]",
  },
  resume: {
    icon: PlayCircle,
    iconColor: "text-[#17B26A]",
    bgLight: "bg-[#ECFDF3]",
    bgDark: "bg-[#0D3321]",
    borderLight: "border-[#ABEFC6]",
    borderDark: "border-[#1F5C3D]",
  },
  disburse: {
    icon: Send,
    iconColor: "text-[#1296DB]",
    bgLight: "bg-[#EBF5FF]",
    bgDark: "bg-[#0A2540]",
    borderLight: "border-[#B2DDFF]",
    borderDark: "border-[#1F4C73]",
  },
  publish: {
    icon: Upload,
    iconColor: "text-[#6366F1]",
    bgLight: "bg-[#EEF2FF]",
    bgDark: "bg-[#1E1B4B]",
    borderLight: "border-[#C7D2FE]",
    borderDark: "border-[#4338CA]",
  },
  complete: {
    icon: CheckCircle2,
    iconColor: "text-[#17B26A]",
    bgLight: "bg-[#ECFDF3]",
    bgDark: "bg-[#0D3321]",
    borderLight: "border-[#ABEFC6]",
    borderDark: "border-[#1F5C3D]",
  },
  pause: {
    icon: PauseCircle,
    iconColor: "text-[#F79009]",
    bgLight: "bg-[#FFFAEB]",
    bgDark: "bg-[#3D2E00]",
    borderLight: "border-[#FEDF89]",
    borderDark: "border-[#6B5300]",
  },
  fund: {
    icon: Wallet,
    iconColor: "text-[#17B26A]",
    bgLight: "bg-[#ECFDF3]",
    bgDark: "bg-[#0D3321]",
    borderLight: "border-[#ABEFC6]",
    borderDark: "border-[#1F5C3D]",
  },
};

export const MilestonePaymentsTable: FC<MilestonePaymentsTableProps> = ({
  projectId,
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
        className={`flex w-fit items-center gap-1/2 rounded-m border px-2 py-1 ${
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
        render: (item: VendorContractEvent) => (
          <span className='font-medium'>
            {item.milestone ? `MS-${item.milestone.milestone_order}` : "-"}
          </span>
        ),
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
        render: (item: VendorContractEvent) => (
          <span className='font-medium'>
            {item.amount_ada !== null ? `₳${formatNumber(item.amount_ada)}` : "-"}
          </span>
        ),
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

  const renderExtraContent = (item: VendorContractEvent) => {
    const formattedDate = item.block_time
      ? new Date(item.block_time * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }) + " (UTC)"
      : null;

    return (
      <div className='grid grid-cols-1 gap-2 bg-darker p-4 md:grid-cols-2'>
        <div className='rounded-l border border-border bg-cardBg p-3'>
          <h4 className='mb-1 text-text-sm font-semibold text-text'>
            {labels.expandedDetails.description}
          </h4>
          <p className='text-text-sm text-grayTextPrimary'>
            {item.milestone?.label || "-"}
          </p>
        </div>

        <div className='rounded-l border border-border bg-cardBg p-3'>
          <h4 className='mb-1 text-text-sm font-semibold text-text'>
            {labels.expandedDetails.evidenceSubmission}
          </h4>
          <div className='flex items-start gap-2'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-m bg-border'>
              <FileText size={20} className='text-grayTextPrimary' />
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <div className='flex items-center justify-between'>
                <span className='text-text-sm font-medium text-text'>
                  {item.milestone
                    ? `Milestone ${item.milestone.milestone_order} - ${item.project.project_name}`
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
                {formattedDate && <span>{formattedDate}</span>}
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
        </div>
      </div>
    );
  };

  return (
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
        extraContent={renderExtraContent}
      />
    </div>
  );
};
