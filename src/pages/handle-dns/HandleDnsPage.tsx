import type { FC } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { RecentlyMintedHandlesTab } from "./tabs/RecentlyMintedHandlesTab";
import { HandleValidatorTab } from "./tabs/HandleValidatorTab";
import { useSearch } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const HandleDnsPage: FC = () => {
  const { t } = useAppTranslation();
  const { tab, handle } = useSearch({ from: "/handle-dns/" });

  const tabs = [
    {
      key: "recently-minted",
      label: t("common:handleDns.tabs.recentlyMinted"),
      content: <RecentlyMintedHandlesTab />,
      visible: true,
    },
    {
      key: "validator",
      label: t("common:handleDns.tabs.validator"),
      content: <HandleValidatorTab initialHandle={handle} />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='handleDns'
      title={
        <span className='flex items-center'>
          <img src={DollarIcon} alt='$' className='h-6 w-6' />
          {t("common:handleDns.title")}
        </span>
      }
      breadcrumbItems={[
        {
          label: (
            <span className='flex items-center'>
              <img src={DollarIcon} alt='$' className='h-4 w-4' />
              {t("common:handleDns.breadcrumb")}
            </span>
          ),
        },
      ]}
    >
      <Tabs items={tabs} activeTabValue={tab || "recently-minted"} />
    </PageBase>
  );
};
