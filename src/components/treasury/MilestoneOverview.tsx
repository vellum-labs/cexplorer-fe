import type { FC } from "react";
import type { Milestone } from "@/services/vendorContracts";
import {
  LoadingSkeleton,
  useThemeStore,
} from "@vellumlabs/cexplorer-sdk";
import { CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface MilestoneOverviewProps {
  milestones: Milestone[];
  isLoading: boolean;
  labels: {
    title: string;
    noMilestones: string;
    amount: string;
    status: string;
    completedAt: string;
    withdrawnAt: string;
    description: string;
    statusLabels: {
      pending: string;
      completed: string;
      withdrawn: string;
    };
  };
}

const statusConfig = {
  pending: {
    icon: Clock,
    iconColor: "text-[#F79009]",
    bgLight: "bg-[#FFFAEB]",
    bgDark: "bg-[#3D2E00]",
    borderLight: "border-[#FEDF89]",
    borderDark: "border-[#6B5300]",
    textLight: "text-[#B54708]",
    textDark: "text-[#FEC84B]",
  },
  completed: {
    icon: CheckCircle2,
    iconColor: "text-[#17B26A]",
    bgLight: "bg-[#ECFDF3]",
    bgDark: "bg-[#0D3321]",
    borderLight: "border-[#ABEFC6]",
    borderDark: "border-[#1F5C3D]",
    textLight: "text-[#067647]",
    textDark: "text-[#75E0A7]",
  },
  withdrawn: {
    icon: CheckCircle2,
    iconColor: "text-[#1296DB]",
    bgLight: "bg-[#EBF5FF]",
    bgDark: "bg-[#0A2540]",
    borderLight: "border-[#B2DDFF]",
    borderDark: "border-[#1F4C73]",
    textLight: "text-[#0E6AAD]",
    textDark: "text-[#84CAFF]",
  },
};

const formatDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return format(date, "MMMM do, yyyy");
  } catch {
    return null;
  }
};

export const MilestoneOverview: FC<MilestoneOverviewProps> = ({
  milestones,
  isLoading,
  labels,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  if (isLoading) {
    return (
      <div className='rounded-l border border-border bg-cardBg p-2'>
        <LoadingSkeleton height='24px' width='150px' />
        <div className='mt-2 flex gap-2 overflow-x-auto pb-2'>
          <LoadingSkeleton height='100px' width='180px' />
          <LoadingSkeleton height='100px' width='180px' />
          <LoadingSkeleton height='100px' width='180px' />
        </div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className='rounded-l border border-border bg-cardBg p-2'>
        <h2 className='text-text-md font-medium'>{labels.title}</h2>
        <p className='mt-2 text-text-sm text-grayTextSecondary'>
          {labels.noMilestones}
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: Milestone["status"]) => {
    const cfg = statusConfig[status] || statusConfig.pending;
    const StatusIcon = cfg.icon;

    return (
      <div className='flex items-center gap-1'>
        <StatusIcon size={14} className={cfg.iconColor} />
        <span
          className={`text-text-xs font-medium ${isDark ? cfg.textDark : cfg.textLight}`}
        >
          {labels.statusLabels[status]}
        </span>
      </div>
    );
  };

  return (
    <div className='rounded-l border border-border bg-cardBg p-2'>
      <h2 className='text-text-md font-medium'>{labels.title}</h2>

      <div className='mt-2 flex gap-0 overflow-x-auto pb-2'>
        {milestones.map((milestone, index) => {
          const completionDate = formatDate(milestone.completion);
          const isLast = index === milestones.length - 1;

          return (
            <div key={milestone.id} className='flex items-start'>
              <div className='flex min-w-[160px] flex-col'>
                <div className='flex items-center'>
                  <div className='rounded-m border border-primary bg-cardBg px-3 py-1 text-text-sm font-medium'>
                    MS-{milestone.milestone_order}
                  </div>
                  {!isLast && (
                    <div
                      className={`h-[1px] flex-1 ${
                        milestone.status === "completed" || milestone.status === "withdrawn"
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>

                <div className='flex flex-col gap-1 pr-3 pt-2'>
                  {getStatusBadge(milestone.status)}

                  {completionDate && (
                    <span className='text-text-xs text-grayTextSecondary'>
                      {completionDate}
                    </span>
                  )}

                  {milestone.status === "completed" && milestone.disbursement && (
                    <span className='inline-flex w-fit items-center rounded-m border border-border px-2 py-0.5 text-text-xs text-grayTextPrimary'>
                      Payment Withdrawn
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
