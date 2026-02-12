import type { FC } from "react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

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

const getMilestoneStatus = (
  total: number,
  completed: number,
  pending: number,
): { status: MilestoneStatus; count?: number } => {
  if (total === 0) {
    return { status: "none" };
  }
  if (completed === total) {
    return { status: "all_claimed" };
  }
  if (pending > 0) {
    return { status: "claimable", count: pending };
  }
  return { status: "none" };
};

const baseStyles = {
  all_claimed: {
    dark: {
      border: "border-[#17B26A]",
      bg: "bg-[#1C3B2D]",
      text: "text-white",
    },
    light: {
      border: "border-[#ABEFC6]",
      bg: "bg-[#ECFDF3]",
      text: "text-[#17B26A]",
    },
  },
  claimable: {
    dark: {
      border: "border-[#0094D4]",
      bg: "bg-[#1C384B]",
      text: "text-white",
    },
    light: {
      border: "border-[#B9E6FE]",
      bg: "bg-[#EFF8FF]",
      text: "text-[#0094D4]",
    },
  },
  none: {
    dark: {
      border: "border-[#475467]",
      bg: "bg-[#1D2939]",
      text: "text-white",
    },
    light: {
      border: "border-[#E4E7EC]",
      bg: "bg-[#F9FAFB]",
      text: "text-[#344054]",
    },
  },
} as const;

export const ContractMilestonesBadge: FC<ContractMilestonesBadgeProps> = ({
  total,
  completed,
  pending,
  labels,
}) => {
  const { theme } = useThemeStore();
  const { status, count } = getMilestoneStatus(total, completed, pending);
  const styles = baseStyles[status][theme];

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
