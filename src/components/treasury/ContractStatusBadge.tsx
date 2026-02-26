import type { FC } from "react";
import {
  contractStatusConfig,
  contractStatusDefaultLabels,
} from "@/constants/treasuryStyles";

export type ContractStatus = "active" | "paused" | "completed" | "cancelled" | "pending_approval";

export interface ContractStatusBadgeProps {
  status: ContractStatus;
  labels?: Partial<Record<ContractStatus, string>>;
}

export const ContractStatusBadge: FC<ContractStatusBadgeProps> = ({
  status,
  labels,
}) => {
  const config = contractStatusConfig[status] || contractStatusConfig.active;
  const Icon = config.icon;
  const label = labels?.[status] ?? contractStatusDefaultLabels[status];

  return (
    <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[10px] text-text-xs'>
      <Icon size={12} className={config.iconColor} />
      <span className='text-nowrap text-text-xs font-medium'>
        {label}
      </span>
    </div>
  );
};
