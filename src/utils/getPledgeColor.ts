import { colors } from "@/constants/colors";

export const getPledgeColor = (pledge: number) => {
  if (pledge > 2000) {
    return colors.redText;
  } else if (pledge > 1000) {
    return colors.yellowText;
  } else {
    return colors.greenText;
  }
};
