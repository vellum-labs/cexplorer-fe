import Swap from "@dexhunterio/swaps";
import "@dexhunterio/swaps/lib/assets/style.css";

interface DexHunterSwapProps {
  orderTypes?: ("SWAP" | "LIMIT")[];
  colors?: {
    background: string;
    containers: string;
    subText: string;
    mainText: string;
    buttonText: string;
    accent: string;
  };
  theme?: "light" | "dark";
  width?: string | number;
  partnerCode?: string;
  partnerName?: string;
  displayType?: "WIDGET" | "DEFAULT" | "BUTTON";
}

export const DexHunterSwap = ({
  orderTypes = ["SWAP", "LIMIT"],
  colors = {
    background: "#DBE1F3",
    containers: "#CFD5EE",
    subText: "#7E88AD",
    mainText: "#0E0F12",
    buttonText: "#FFFFFF",
    accent: "#007DFF",
  },
  theme = "light",
  width = 450,
  partnerCode = "cexplorernextgen61646472317139737a356b773430706d6e6b636d6d667673736d35667932767a6b6b376c30777535737a7632356e6e66666b716e6b633335717972676e717538746c3936753565656a79746776747371617472326d733668727868647a713470736c767032726dda39a3ee5e6b4b0d3255bfef95601890afd80709",
  partnerName = "cexplorernextgen",
  displayType = "DEFAULT",
}: DexHunterSwapProps) => {
  return (
    <div className="w-full">
      <Swap
        orderTypes={orderTypes as any}
        colors={colors as any}
        theme={theme}
        width={String(width)}
        partnerCode={partnerCode}
        partnerName={partnerName}
        displayType={displayType}
      />
    </div>
  );
};
