import type { FC } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { RecentlyMintedHandlesTab } from "./tabs/RecentlyMintedHandlesTab";
import { HandleValidatorTab } from "./tabs/HandleValidatorTab";
import { useSearch } from "@tanstack/react-router";

export const HandleDnsPage: FC = () => {
  const { tab, handle } = useSearch({ from: "/handle-dns/" });

  const tabs = [
    {
      key: "recently-minted",
      label: "Recently minted",
      content: <RecentlyMintedHandlesTab />,
      visible: true,
    },
    {
      key: "validator",
      label: "Handle validator",
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
          handle DNS
        </span>
      }
      breadcrumbItems={[
        {
          label: (
            <span className='flex items-center'>
              <img src={DollarIcon} alt='$' className='h-4 w-4' />
              handle DNS
            </span>
          ),
        },
      ]}
    >
      <Tabs items={tabs} activeTabValue={tab || "recently-minted"} />
    </PageBase>
  );
};
