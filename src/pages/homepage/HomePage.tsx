import type { FC } from "react";

import { Wand } from "lucide-react";
import { HomepageGrid } from "@/components/homepage/grid/HomepageGrid";
import { HomepageOverview } from "@/components/homepage/HomepageOverview";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { HomepageCustomize } from "@/components/homepage/HomepageCustomize";
import { HomepageModal } from "@/components/homepage/HomepageModal";
import { HomepageAds } from "@/components/homepage/HomepageAds";

import { useHomepageStore } from "@/stores/homepageStore";
import { PageBase } from "@/components/global/pages/PageBase";
import { useFetchMiscBasic } from "@/services/misc";

export const Homepage: FC = () => {
  const { handleCustomize, addWidget, customize } = useHomepageStore();

  const miscBasic = useFetchMiscBasic();

  const miscBasicAds =
    !miscBasic.isLoading &&
    miscBasic?.data &&
    miscBasic?.data?.data?.ads &&
    Array.isArray(miscBasic?.data?.data?.ads) &&
    miscBasic?.data?.data?.ads.length > 0
      ? miscBasic?.data?.data?.ads
      : false;

  const HOMEPAGE_ADS_TYPE = "header_featured";

  const homepageAds = miscBasicAds
    ? miscBasicAds.filter(item => item.type === HOMEPAGE_ADS_TYPE)
    : undefined;

  return (
    <>
      <PageBase
        title='Explore Cardano blockchain'
        metadataTitle='homepage'
        isHomepage
        homepageAd={
          homepageAds ? (
            <HomepageAds
              miscBasicAds={homepageAds.sort(() => Math.random() - 0.5)}
            />
          ) : undefined
        }
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
                label='Customize'
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
