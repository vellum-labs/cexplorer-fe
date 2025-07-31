import { colors } from "@/constants/colors";
import { useThemeStore } from "@/stores/themeStore";

export const useGraphColors = () => {
  const { theme } = useThemeStore();
  const textColor = theme === "dark" ? "white" : "#101828";
  const bgColor = colors.cardBg;
  const splitLineColor =
    theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0, 0, 0, 0.2)";
  const lineColor = theme === "dark" ? "#79defd" : "#0094d4";
  const inactivePageIconColor = "#858585";
  const purpleColor = theme === "dark" ? "#9f7aea" : "#7d41ed";

  return {
    textColor,
    bgColor,
    splitLineColor,
    lineColor,
    inactivePageIconColor,
    purpleColor,
  };
};
