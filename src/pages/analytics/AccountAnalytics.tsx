import { AccounntTopAddressesTab } from "@/components/analytics/account/tabs/AccounntTopAddressesTab";
import { AccountTopStakingTab } from "@/components/analytics/account/tabs/AccountTopStakingTab";
import { AccountWalletActivityTab } from "@/components/analytics/account/tabs/AccountWalletActivityTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import type { FC } from "react";

import { WealthComposition } from "@/components/analytics/account/tabs/WealthComposition";
import { useFetchEpochAnalytics } from "@/services/analytics";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const AccountAnalytics: FC = () => {
  const { t } = useAppTranslation();
  const epochQuery = useFetchEpochAnalytics();

  const tabs = [
    {
      key: "wallet_activity",
      label: t("tabs.analytics.walletActivity"),
      content: <AccountWalletActivityTab epochQuery={epochQuery} />,
      visible: true,
    },
    {
      key: "top_staking_accounts",
      label: t("tabs.analytics.topStakingAccounts"),
      content: () => <AccountTopStakingTab />,
      visible: true,
    },
    {
      key: "top_addresses",
      label: t("tabs.analytics.topAddresses"),
      content: () => <AccounntTopAddressesTab />,
      visible: true,
    },
    {
      key: "wealth_composition",
      label: t("tabs.analytics.wealthComposition"),
      content: <WealthComposition />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='accountAnalytics'
      breadcrumbItems={[
        { label: t("breadcrumbs.analytics"), link: "/analytics" },
        { label: t("breadcrumbs.account") },
      ]}
      title={t("pages.accountAnalytics.title")}
    >
      <Tabs
        items={tabs}
        forceDropdownVerticalPosition='down'
        wrapperClassname='my-0'
      />
    </PageBase>
  );
};
