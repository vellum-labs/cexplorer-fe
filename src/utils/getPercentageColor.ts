import { colors } from "@/constants/colors";

export const getPercentageColor = (percentage: number): string => {
  if (percentage <= 33) {
    return colors.greenText;
  } else if (percentage <= 66) {
    return colors.yellowText;
  } else {
    return colors.redText;
  }
};
