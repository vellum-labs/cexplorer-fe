import type { DexConfig } from "@/types/tokenTypes";

import SundaeSwapIcon from "@/resources/images/icons/sundaeswap.png";
import SundaeSwapV3Icon from "@/resources/images/icons/sundaeswap_V3.webp";
import MinSwapIcon from "@/resources/images/icons/minswap.png";
import MinSwapV2Icon from "@/resources/images/icons/minswap_V2.webp";
import WingRidersIcon from "@/resources/images/icons/wingriders.webp";
import WingRidersV2Icon from "@/resources/images/icons/wingriders_V2.webp";
import MuesliSwapIcon from "@/resources/images/icons/muesliswap.png";
import VyFinanceIcon from "@/resources/images/icons/vyfinance.png";
import DexHunterIcon from "@/resources/images/icons/dexhunter.svg";
import SplashIcon from "@/resources/images/icons/splash.webp";
import SnekFunIcon from "@/resources/images/icons/snekfun.webp";
import CSwapIcon from "@/resources/images/icons/cswap.webp";
import ChadSwapIcon from "@/resources/images/icons/chadswap.webp";

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
    icon: SundaeSwapV3Icon,
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
    icon: MinSwapV2Icon,
    textColor: "#001947",
    bgColor: "#DFE8FF",
    borderColor: "#83A2DC",
  },
  WINGRIDER: {
    label: "WingRiders",
    icon: WingRidersIcon,
    textColor: "#7C3AED",
    bgColor: "#F3E8FF",
    borderColor: "#C4B5FD",
  },
  WINGRIDERV2: {
    label: "WingRidersV2",
    icon: WingRidersV2Icon,
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
  VYFI: {
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
  SPLASH: {
    label: "Splash",
    icon: SplashIcon,
    textColor: "#0369A1",
    bgColor: "#E0F2FE",
    borderColor: "#7DD3FC",
  },
  SNEKFUN: {
    label: "SnekFun",
    icon: SnekFunIcon,
    textColor: "#15803D",
    bgColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },
  CSWAP: {
    label: "CSwap",
    icon: CSwapIcon,
    textColor: "#9333EA",
    bgColor: "#FAF5FF",
    borderColor: "#D8B4FE",
  },
  CHADSWAP: {
    label: "ChadSwap",
    icon: ChadSwapIcon,
    textColor: "#B91C1C",
    bgColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
};

export const DEXHUNTER_PARTNER_CODE =
  "cexplorernextgen61646472317139737a356b773430706d6e6b636d6d667673736d35667932767a6b6b376c30777535737a7632356e6e66666b716e6b633335717972676e717538746c3936753565656a79746776747371617472326d733668727868647a713470736c767032726mda39a3ee5e6b4b0d3255bfef95601890afd80709";

export const DEXHUNTER_PARTNER_NAME = "cexplorernextgen";

export const DEXHUNTER_COLORS = {
  background: "var(--cardBg)",
  containers: "var(--background)",
  subText: "var(--grayTextPrimary)",
  mainText: "var(--text)",
  buttonText: "var(--white)",
  accent: "var(--primary)",
};
