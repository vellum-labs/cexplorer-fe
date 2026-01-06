import type { FC } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { RecentlyMintedHandlesTab } from "./tabs/RecentlyMintedHandlesTab";
import { HandleValidatorTab } from "./tabs/HandleValidatorTab";

export const HandleDnsPage: FC = () => {
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
      content: <HandleValidatorTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='handleDns'
      title='$handle DNS'
      breadcrumbItems={[
        {
          label: <span>$handle DNS</span>,
        },
      ]}
    >
      <Tabs items={tabs} />
    </PageBase>
  );
};
