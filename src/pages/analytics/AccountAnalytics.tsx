import { AccounntTopAddressesTab } from "@/components/analytics/account/tabs/AccounntTopAddressesTab";
import { AccountTopStakingTab } from "@/components/analytics/account/tabs/AccountTopStakingTab";
import { AccountWalletActivityTab } from "@/components/analytics/account/tabs/AccountWalletActivityTab";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import type { FC } from "react";

import { WealthComposition } from "@/components/analytics/account/tabs/WealthComposition";
import { useFetchEpochAnalytics } from "@/services/analytics";
import { PageBase } from "@/components/global/pages/PageBase";

export const AccountAnalytics: FC = () => {
  const epochQuery = useFetchEpochAnalytics();

  const tabs = [
    {
      key: "wallet_activity",
      label: "Wallet activity",
      content: <AccountWalletActivityTab epochQuery={epochQuery} />,
      visible: true,
    },
    {
      key: "top_staking_accounts",
      label: "Top staking accounts",
      content: () => <AccountTopStakingTab />,
      visible: true,
    },
    {
      key: "top_addresses",
      label: "Top addresses",
      content: () => <AccounntTopAddressesTab />,
      visible: true,
    },
    {
      key: "wealth_composition",
      label: "Wealth composition",
      content: <WealthComposition />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='accountAnalytics'
      breadcrumbItems={[
        { label: "Analytics", link: "/analytics" },
        { label: "Account" },
      ]}
      title='Cardano account analytics'
    >
      <Tabs
        items={tabs}
        forceDropdownVerticalPosition='down'
        wrapperClassname='my-0'
      />
    </PageBase>
  );
};
