import { colors } from "@/constants/colors";

export const getPledgeColor = (leverage: number, zeroPledge = false) => {
  if (zeroPledge || leverage > 2000) {
    return colors.redText;
  } else if (leverage > 1000) {
    return colors.yellowText;
  } else {
    return colors.greenText;
  }
};
