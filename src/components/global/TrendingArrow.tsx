import { colors } from "@/constants/colors";
import type { ReactNode } from "@tanstack/react-router";
import { TrendingDown, TrendingUp } from "lucide-react";

export const TrendingArrow = ({
  percentage,
  size = 20,
}: {
  percentage: number;
  size?: number;
}): ReactNode | null => {
  if (percentage === 0) return null;
  else if (percentage > 0)
    return <TrendingUp color={colors.greenText} size={size} />;
  else return <TrendingDown color={colors.redText} size={size} />;
};
