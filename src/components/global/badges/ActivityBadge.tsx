import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

export interface ActivityBadgeProps {
  percentage: number;
}

export const ActivityBadge = ({ percentage }: ActivityBadgeProps) => {
  const { theme } = useThemeStore();

  const getActivityLevel = (percent: number) => {
    if (percent >= 90) return "high";
    if (percent >= 50) return "medium";
    return "low";
  };

  const activityLevel = getActivityLevel(percentage);

  const styles = {
    low: {
      dark: {
        border: "border-[#F04438]",
        bg: "bg-[#3A1F1F]",
        text: "text-white",
      },
      light: {
        border: "border-[#F04438]",
        bg: "bg-[#FEF2F2]",
        text: "text-[#DC2626]",
      },
    },
    medium: {
      dark: {
        border: "border-[#F59E0B]",
        bg: "bg-[#3A2F1F]",
        text: "text-white",
      },
      light: {
        border: "border-[#F59E0B]",
        bg: "bg-[#FFFBEB]",
        text: "text-[#D97706]",
      },
    },
    high: {
      dark: {
        border: "border-[#10B981]",
        bg: "bg-[#1F2937]",
        text: "text-white",
      },
      light: {
        border: "border-[#10B981]",
        bg: "bg-[#F0FDF4]",
        text: "text-[#059669]",
      },
    },
  };

  const currentStyle = styles[activityLevel][theme];

  return (
    <div
      className={`flex h-[24px] w-fit items-center rounded-xl border px-[8px] py-[2px] ${currentStyle.border} ${currentStyle.bg}`}
    >
      <span
        className={`text-xs whitespace-nowrap font-medium ${currentStyle.text}`}
      >
        {percentage.toFixed(2)}%
      </span>
    </div>
  );
};
