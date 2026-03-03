import type { MilestoneStatus } from "@/components/treasury/ContractMilestonesBadge";
import type { ContractStatus } from "@/components/treasury/ContractStatusBadge";
import {
  Check,
  Clock,
  Pause,
  X,
  Loader,
  CheckCircle2,
  ArrowDownCircle,
  PlayCircle,
  PauseCircle,
  Wallet,
  Send,
  Upload,
  Zap,
} from "lucide-react";

export const milestoneBaseStyles = {
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

export const contractStatusConfig: Record<
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

export const contractStatusDefaultLabels: Record<ContractStatus, string> = {
  completed: "Completed",
  active: "In Progress",
  paused: "Paused",
  cancelled: "Cancelled",
  pending_approval: "Pending Approval",
};

export const milestoneStatusConfig = {
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

export const eventConfig = {
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

export const getMilestoneStatus = (
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
