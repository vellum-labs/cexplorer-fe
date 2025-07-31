import type { FC } from "react";
import { TokenDashboardTokenTab } from "@/components/token/dashboard/tabs/TokenDashboardTokenTab";
import { TokenDashboardExchangeTab } from "@/components/token/dashboard/tabs/TokenDashboardExchangeTab";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import Tabs from "@/components/global/Tabs";
import { useSearch } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";

export const TokenDashboardPage: FC = () => {
  const { page } = useSearch({ from: "/token/dashboard/" });

  const tabs = [
    {
      key: "tokens",
      label: "Tokens",
      content: <TokenDashboardTokenTab />,
      visible: true,
    },
    {
      key: "global_activity",
      label: "Global activity",
      content: () => <DeFiOrderList page={page} tabName='global_activity' />,
      visible: true,
    },
    {
      key: "exchange",
      label: "Exchange",
      content: <TokenDashboardExchangeTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='tokenDashboard'
      title='Token dashboard'
      breadcrumbItems={[{ label: "Token" }, { label: "Dashboard" }]}
    >
      <Tabs items={tabs} />
    </PageBase>
  );
};
