import type { FC } from "react";

import { Wand } from "lucide-react";
import { HomepageGrid } from "@/components/homepage/grid/HomepageGrid";
import { HomepageOverview } from "@/components/homepage/HomepageOverview";
import Button from "@/components/global/Button";
import { HomepageCustomize } from "@/components/homepage/HomepageCustomize";
import { HomepageModal } from "@/components/homepage/HomepageModal";

import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { useHomepageStore } from "@/stores/homepageStore";
import { PageBase } from "@/components/global/pages/PageBase";

export const Homepage: FC = () => {
  const { handleCustomize, addWidget, customize } = useHomepageStore();
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    const configScript = document.createElement("script");

    script.src = "https://i.jamonbread.io/host/embed.js";

    configScript.text = `
        window.jamConfig = {
          affilCode : "",
          theme: "dark",
          logoUrl: "",
          logoSize: "30px",
          projectName: "",
          nameFontSize: "14px",
          showPopup: true,
          wallet : "",
          alwaysDisplayButton: false,
        };
      `;

    document.body.appendChild(configScript);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(configScript);
      document.body.removeChild(script);
    };
  }, [location.pathname]);

  return (
    <>
      <PageBase
        title='Explore Cardano blockchain'
        metadataTitle='homepage'
        isHomepage
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
