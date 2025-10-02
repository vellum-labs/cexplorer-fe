import SundaeSwapIcon from "@/resources/images/icons/sundaeswap.png";
import MinSwapIcon from "@/resources/images/icons/minswap.png";
import WingRidersIcon from "@/resources/images/icons/wingrider.png";
import MuesliSwapIcon from "@/resources/images/icons/muesliswap.png";
import VyFinanceIcon from "@/resources/images/icons/vyfinance.png";
import DexHunterIcon from "@/resources/images/icons/dexhunter.svg";

export interface DexConfig {
  label: string;
  icon: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export const dexConfig: Record<string, DexConfig> = {
  SUNDAESWAP: {
    label: "SundaeSwap",
    icon: SundaeSwapIcon,
    textColor: "#E04F16",
    bgColor: "#FFF4ED",
    borderColor: "#FFD6AE",
  },
  SUNDAESWAPV3: {
    label: "SundaeSwapV3",
    icon: SundaeSwapIcon,
    textColor: "#E04F16",
    bgColor: "#FFF4ED",
    borderColor: "#FFD6AE",
  },
  MINSWAP: {
    label: "Minswap",
    icon: MinSwapIcon,
    textColor: "#001947",
    bgColor: "#DFE8FF",
    borderColor: "#83A2DC",
  },
  MINSWAPV2: {
    label: "MinswapV2",
    icon: MinSwapIcon,
    textColor: "#001947",
    bgColor: "#DFE8FF",
    borderColor: "#83A2DC",
  },
  WINGRIDERS: {
    label: "WingRiders",
    icon: WingRidersIcon,
    textColor: "#7C3AED",
    bgColor: "#F3E8FF",
    borderColor: "#C4B5FD",
  },
  WINGRIDER: {
    label: "WingRiders",
    icon: WingRidersIcon,
    textColor: "#7C3AED",
    bgColor: "#F3E8FF",
    borderColor: "#C4B5FD",
  },
  MUESLISWAP: {
    label: "MuesliSwap",
    icon: MuesliSwapIcon,
    textColor: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  VYFINANCE: {
    label: "VyFinance",
    icon: VyFinanceIcon,
    textColor: "#7C2D12",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  DEXHUNTER: {
    label: "DexHunter",
    icon: DexHunterIcon,
    textColor: "#1F2937",
    bgColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },
};
