import type { FC } from "react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import {
  milestoneBaseStyles,
  getMilestoneStatus,
} from "@/constants/treasuryStyles";

export type MilestoneStatus = "all_claimed" | "claimable" | "none";

export interface ContractMilestonesBadgeProps {
  total: number;
  completed: number;
  pending: number;
  labels?: {
    allClaimed?: string;
    claimable?: string;
    none?: string;
  };
}

export const ContractMilestonesBadge: FC<ContractMilestonesBadgeProps> = ({
  total,
  completed,
  pending,
  labels,
}) => {
  const { theme } = useThemeStore();
  const { status, count } = getMilestoneStatus(total, completed, pending);
  const styles = milestoneBaseStyles[status][theme];

  const getLabel = () => {
    switch (status) {
      case "all_claimed":
        return labels?.allClaimed ?? "All claimed";
      case "claimable":
        return `${count} ${labels?.claimable ?? "Claimable"}`;
      case "none":
        return labels?.none ?? "None";
    }
  };

  return (
    <div
      className={`flex h-[24px] w-fit items-center gap-1 whitespace-nowrap rounded-xl border px-[8px] py-[2px] ${styles.border} ${styles.bg}`}
    >
      <span className={`text-text-xs font-medium ${styles.text}`}>
        {getLabel()}
      </span>
    </div>
  );
};
