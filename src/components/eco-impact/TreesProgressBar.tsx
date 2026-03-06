import type { FC } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { formatNumber, useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { Sprout } from "lucide-react";
import { MILESTONES } from "@/constants/ecoImpact";

interface TreesProgressBarProps {
  trees: number;
}

export const TreesProgressBar: FC<TreesProgressBarProps> = ({ trees }) => {
  const { t } = useAppTranslation("common");
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const currentMilestoneIndex = MILESTONES.findIndex(m => m > trees);
  const nextMilestone =
    currentMilestoneIndex === -1
      ? MILESTONES[MILESTONES.length - 1]
      : MILESTONES[currentMilestoneIndex];
  const prevMilestone =
    currentMilestoneIndex <= 0 ? 0 : MILESTONES[currentMilestoneIndex - 1];

  const progress =
    nextMilestone === prevMilestone
      ? 99
      : Math.min(
          ((trees - prevMilestone) / (nextMilestone - prevMilestone)) * 100,
          99,
        );

  return (
    <div
      className='flex flex-col gap-3 rounded-m border p-4'
      style={{
        backgroundColor: isDark ? "rgba(22, 101, 52, 0.15)" : "#f0fdf4",
        borderColor: isDark ? "rgba(34, 197, 94, 0.25)" : "#bbf7d0",
      }}
    >
      <div className='flex items-center gap-2'>
        <Sprout size={20} style={{ color: isDark ? "#4ade80" : "#166534" }} />
        <span
          className='text-text-sm font-semibold'
          style={{ color: isDark ? "#4ade80" : "#166534" }}
        >
          {t("ecoImpact.results.treesEquivalent")}
        </span>
      </div>

      <div className='flex items-center justify-between'>
        <span
          className='text-text-sm font-medium'
          style={{ color: isDark ? "#86efac" : "#14532d" }}
        >
          {t("ecoImpact.results.treesEquivalent")}
        </span>
        <span
          className='text-text-sm font-bold'
          style={{ color: isDark ? "#86efac" : "#14532d" }}
        >
          {formatNumber(Math.round(trees * 100) / 100)}/{formatNumber(nextMilestone)}{" "}
          {t("ecoImpact.results.trees")}
        </span>
      </div>

      <div className='flex flex-col gap-1'>
        <div
          className='h-3 w-full overflow-hidden rounded-max'
          style={{
            backgroundColor: isDark ? "rgba(34, 197, 94, 0.2)" : "#dcfce7",
          }}
        >
          <div
            className='h-full rounded-max transition-all duration-500'
            style={{
              width: `${progress}%`,
              backgroundColor: isDark ? "#16a34a" : "#15803d",
            }}
          />
        </div>
      </div>

      <p
        className='text-text-xs'
        style={{ color: isDark ? "rgba(134, 239, 172, 0.7)" : "#4d7c5e" }}
      >
        {t("ecoImpact.results.treesDescription")}
      </p>
    </div>
  );
};
