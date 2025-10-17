import { ChevronUp, ChevronDown, Minus } from "lucide-react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { VOTE_OPTIONS } from "@/constants/votes";

export interface VoteBadgeProps {
  vote: Vote;
}

export const VoteBadge = ({ vote }: VoteBadgeProps) => {
  const { theme } = useThemeStore();

  // Handle "Not voted" case or invalid vote values
  if (!vote || vote === null || !VOTE_OPTIONS.includes(vote as any)) {
    return (
      <div
        className={`flex h-[24px] w-fit items-center gap-1/2 rounded-l border px-[8px] py-[2px] ${theme === "dark" ? "border-[#475467] bg-[#1D2939]" : "border-[#E4E7EC] bg-[#F9FAFB]"}`}
      >
        <span
          className={`whitespace-nowrap text-text-xs font-medium ${theme === "dark" ? "text-white" : "text-[#344054]"}`}
        >
          Not voted
        </span>
      </div>
    );
  }

  const baseStyles = {
    Yes: {
      dark: {
        border: "border-[#0094D4]",
        bg: "bg-[#1C384B]",
        text: "text-white",
        icon: "text-white",
      },
      light: {
        border: "border-[#00A9E3]",
        bg: "bg-[#EFFAFF]",
        text: "text-[#0094D4]",
        icon: "text-[#0094D4]",
      },
    },
    No: {
      dark: {
        border: "border-[#DC6803]",
        bg: "bg-[#392E33]",
        text: "text-white",
        icon: "text-white",
      },
      light: {
        border: "border-[#FEDF89]",
        bg: "bg-[#FFFAEB]",
        text: "text-[#DC6803]",
        icon: "text-[#DC6803]",
      },
    },
    Abstain: {
      dark: {
        border: "border-[#475467]",
        bg: "bg-[#1D2939]",
        text: "text-white",
        icon: "text-white",
      },
      light: {
        border: "border-[#E4E7EC]",
        bg: "bg-[#F9FAFB]",
        text: "text-[#344054]",
        icon: "text-[#344054]",
      },
    },
  } as const;

  const styles = baseStyles[vote][theme];

  const icon = {
    Yes: <ChevronUp size={14} className={styles.icon} />,
    No: <ChevronDown size={14} className={styles.icon} />,
    Abstain: <Minus size={14} className={styles.icon} />,
  } as const;

  return (
    <div
      className={`flex w-fit items-center gap-1 rounded-xl border ${styles.border} ${styles.bg} h-[24px] px-[8px] py-[2px]`}
    >
      {icon[vote]}
      <span className={`text-text-xs font-medium ${styles.text}`}>{vote}</span>
    </div>
  );
};
