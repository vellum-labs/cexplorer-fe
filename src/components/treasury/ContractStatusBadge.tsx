import type { FC } from "react";
import { Check, Clock, Pause, X, Loader } from "lucide-react";

export type ContractStatus = "active" | "paused" | "completed" | "cancelled" | "pending_approval";

export interface ContractStatusBadgeProps {
  status: ContractStatus;
  labels?: Partial<Record<ContractStatus, string>>;
}

const statusConfig: Record<
  ContractStatus,
  {
    icon: typeof Check;
    iconColor: string;
  }
> = {
  completed: {
    icon: Check,
    iconColor: "text-[#17B26A]",
  },
  active: {
    icon: Clock,
    iconColor: "text-[#0094D4]",
  },
  paused: {
    icon: Pause,
    iconColor: "text-[#F79009]",
  },
  cancelled: {
    icon: X,
    iconColor: "text-[#F04438]",
  },
  pending_approval: {
    icon: Loader,
    iconColor: "text-[#667085]",
  },
};

const defaultLabels: Record<ContractStatus, string> = {
  completed: "Completed",
  active: "In Progress",
  paused: "Paused",
  cancelled: "Cancelled",
  pending_approval: "Pending Approval",
};

export const ContractStatusBadge: FC<ContractStatusBadgeProps> = ({
  status,
  labels,
}) => {
  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;
  const label = labels?.[status] ?? defaultLabels[status];

  return (
    <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
      <Icon size={12} className={config.iconColor} />
      <span className='text-nowrap text-text-xs font-medium'>
        {label}
      </span>
    </div>
  );
};
