import type { FC } from "react";

import { NetworkBlocksTab } from "@/components/analytics/network/tabs/NetworkBlocksTab";
import { NetworkBlockVersionsTab } from "@/components/analytics/network/tabs/NetworkBlockVersionsTab";
import { NetworkEnergyConsumption } from "@/components/analytics/network/tabs/NetworkEnergyConsumption";
import { NetworkHealthTab } from "@/components/analytics/network/tabs/NetworkHealthTab";
import { NetworkStorageTab } from "@/components/analytics/network/tabs/NetworkStorageTab";
import { NetworkTransactionTab } from "@/components/analytics/network/tabs/NetworkTransactionsTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";

import { PageBase } from "@/components/global/pages/PageBase";

export const NetworkAnalytics: FC = () => {
  const tabs = [
    {
      key: "transactions",
      label: "Transactions",
      content: <NetworkTransactionTab />,
      visible: true,
    },
    {
      key: "blocks",
      label: "Blocks",
      content: <NetworkBlocksTab />,
      visible: true,
    },
    {
      key: "health",
      label: "Health",
      content: <NetworkHealthTab />,
      visible: true,
    },
    {
      key: "energy_consumption",
      label: "Energy consumption",
      content: <NetworkEnergyConsumption />,
      visible: true,
    },
    {
      key: "block_versions",
      label: "Block versions",
      content: <NetworkBlockVersionsTab />,
      visible: true,
    },
    {
      key: "storage",
      label: "Storage",
      content: <NetworkStorageTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='networkAnalytics'
      breadcrumbItems={[
        { label: "Analytics", link: "/analytics" },
        { label: "Network" },
      ]}
      title='Cardano network analytics'
    >
      <Tabs
        items={tabs}
        forceDropdownVerticalPosition='down'
        wrapperClassname='mt-0'
      />
    </PageBase>
  );
};
