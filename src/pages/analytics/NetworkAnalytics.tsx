import type { FC } from "react";

import { NetworkBlocksTab } from "@/components/analytics/network/tabs/NetworkBlocksTab";
import { NetworkBlockVersionsTab } from "@/components/analytics/network/tabs/NetworkBlockVersionsTab";
import { NetworkEnergyConsumption } from "@/components/analytics/network/tabs/NetworkEnergyConsumption";
import { NetworkHealthTab } from "@/components/analytics/network/tabs/NetworkHealthTab";
import { NetworkStorageTab } from "@/components/analytics/network/tabs/NetworkStorageTab";
import { NetworkTransactionTab } from "@/components/analytics/network/tabs/NetworkTransactionsTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";

import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const NetworkAnalytics: FC = () => {
  const { t } = useAppTranslation("common");

  const tabs = [
    {
      key: "transactions",
      label: t("analytics.transactionsTab"),
      content: <NetworkTransactionTab />,
      visible: true,
    },
    {
      key: "blocks",
      label: t("analytics.blocksTab"),
      content: <NetworkBlocksTab />,
      visible: true,
    },
    {
      key: "health",
      label: t("analytics.healthTab"),
      content: <NetworkHealthTab />,
      visible: true,
    },
    {
      key: "energy_consumption",
      label: t("analytics.energyConsumptionTab"),
      content: <NetworkEnergyConsumption />,
      visible: true,
    },
    {
      key: "block_versions",
      label: t("analytics.blockVersionsTab"),
      content: <NetworkBlockVersionsTab />,
      visible: true,
    },
    {
      key: "storage",
      label: t("analytics.storageTab"),
      content: <NetworkStorageTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='networkAnalytics'
      breadcrumbItems={[
        { label: t("analyticsPage.breadcrumb"), link: "/analytics" },
        { label: t("analytics.network") },
      ]}
      title={t("analytics.cardanoNetworkAnalytics")}
    >
      <Tabs
        items={tabs}
        forceDropdownVerticalPosition='down'
        wrapperClassname='mt-0'
      />
    </PageBase>
  );
};
