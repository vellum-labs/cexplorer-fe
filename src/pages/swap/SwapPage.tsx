import type { FC } from "react";

import { PageBase } from "@/components/global/pages/PageBase";
import { DexHunterSwap } from "@/components/swap/DexHunterSwap";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

export const SwapPage: FC = () => {
  const { theme } = useThemeStore();

  // Configure colors based on theme
  const colors = theme === "dark"
    ? {
        background: "#1a1b1e",
        containers: "#2a2b2e",
        subText: "#9ca3af",
        mainText: "#f3f4f6",
        buttonText: "#ffffff",
        accent: "#007DFF",
      }
    : {
        background: "#DBE1F3",
        containers: "#CFD5EE",
        subText: "#7E88AD",
        mainText: "#0E0F12",
        buttonText: "#FFFFFF",
        accent: "#007DFF",
      };

  return (
    <PageBase
      metadataTitle='swap'
      breadcrumbItems={[{ label: "Swap" }]}
      title={<div className='flex items-center gap-1/2'>Swap</div>}
    >
      <div className='flex w-full flex-col pt-4'>
        <section className='flex w-full flex-col items-center pb-3'>
          <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
            <div className='flex w-full flex-col justify-between gap-3 rounded-m lg:flex-row'>
              {/* DexHunter embed */}
              <div className='flex-1'>
                <DexHunterSwap
                  orderTypes={["SWAP", "LIMIT"]}
                  colors={colors}
                  theme={theme}
                  width="450"
                  partnerCode="cexplorernextgen61646472317139737a356b773430706d6e6b636d6d667673736d35667932767a6b6b376c30777535737a7632356e6e66666b716e6b633335717972676e717538746c3936753565656a79746776747371617472326d733668727868647a713470736c767032726dda39a3ee5e6b4b0d3255bfef95601890afd80709"
                  partnerName="cexplorernextgen"
                  displayType="DEFAULT"
                />
              </div>

              {/* Token chart */}
              <div className='flex-1'>
                {/* Token chart placeholder - will be implemented in next phase */}
                <div className='rounded-lg border border-border bg-card p-4 min-h-[500px] flex items-center justify-center'>
                  <p className='text-muted-foreground'>Token chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageBase>
  );
};
