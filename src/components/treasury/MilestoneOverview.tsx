import type { FC } from "react";
import type { Milestone } from "@/services/vendorContracts";
import {
  LoadingSkeleton,
  useThemeStore,
  formatDate,
} from "@vellumlabs/cexplorer-sdk";
import { milestoneStatusConfig } from "@/constants/treasuryStyles";

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
    const cfg = milestoneStatusConfig[status] || milestoneStatusConfig.pending;
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
          const completionDate = milestone.completion
            ? formatDate(new Date(milestone.completion).getTime())
            : null;
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
                      {labels.statusLabels.withdrawn}
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
