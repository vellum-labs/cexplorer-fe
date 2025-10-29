import type { FC } from "react";

import { PageBase } from "@/components/global/pages/PageBase";
import { DexHunterSwap } from "@/components/swap/DexHunterSwap";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

export const SwapPage: FC = () => {
  const { theme } = useThemeStore();

  const colors = {
    background: "var(--cardBg)",
    containers: "var(--background)",
    subText: "var(--grayTextPrimary)",
    mainText: "var(--text)",
    buttonText: "var(--white)",
    accent: "var(--primary)",
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
              <div className='flex-1'>
                <DexHunterSwap
                  orderTypes={["SWAP", "LIMIT"]}
                  colors={colors}
                  theme={theme}
                  width='450'
                  partnerCode='cexplorernextgen61646472317139737a356b773430706d6e6b636d6d667673736d35667932767a6b6b376c30777535737a7632356e6e66666b716e6b633335717972676e717538746c3936753565656a79746776747371617472326d733668727868647a713470736c767032726dda39a3ee5e6b4b0d3255bfef95601890afd80709'
                  partnerName='cexplorernextgen'
                  displayType='DEFAULT'
                />
              </div>

              <div className='flex-1'>
                <div className='rounded-lg bg-card flex min-h-[500px] items-center justify-center border border-border p-4'>
                  <p className='text-muted-foreground'>
                    Token chart will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageBase>
  );
};
