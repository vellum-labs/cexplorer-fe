import type { FC } from "react";

import { Wand } from "lucide-react";
import { HomepageGrid } from "@/components/homepage/grid/HomepageGrid";
import { HomepageOverview } from "@/components/homepage/HomepageOverview";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { HomepageCustomize } from "@/components/homepage/HomepageCustomize";
import { HomepageModal } from "@/components/homepage/HomepageModal";

import { useHomepageStore } from "@/stores/homepageStore";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const Homepage: FC = () => {
  const { handleCustomize, addWidget, customize } = useHomepageStore();
  const { t } = useAppTranslation("common");

  return (
    <>
      <PageBase
        title={t("homepage.exploreCardano")}
        metadataTitle='homepage'
        isHomepage
        homepageAd
      >
        <section
          className={`flex w-full ${customize ? "select-none" : ""} flex-col items-center`}
        >
          <div className='mb-3 flex w-full max-w-desktop flex-col items-center gap-1.5 px-mobile md:px-desktop'>
            <div className='flex w-full justify-end gap-2'>
              <Button
                size='md'
                variant='tertiary'
                leftIcon={<Wand size={16} />}
                onClick={handleCustomize}
                label={t("homepage.customize")}
              />
            </div>
            {customize && <HomepageCustomize />}
            <div className='flex w-full flex-col gap-3'>
              <div className='w-full'>
                <HomepageOverview />
              </div>
              <div className='flex w-full items-center'>
                <HomepageGrid />
              </div>
            </div>
          </div>
        </section>
      </PageBase>
      {addWidget && <HomepageModal />}
    </>
  );
};
