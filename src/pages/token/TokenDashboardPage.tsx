import type { FC } from "react";
import { TokenDashboardTokenTab } from "@/components/token/dashboard/tabs/TokenDashboardTokenTab";
import { TokenDashboardExchangeTab } from "@/components/token/dashboard/tabs/TokenDashboardExchangeTab";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const TokenDashboardPage: FC = () => {
  const { t } = useAppTranslation();
  const { page } = useSearch({ from: "/token/dashboard/" });

  const tabs = [
    {
      key: "tokens",
      label: t("token.dashboard.tabs.tokens"),
      content: <TokenDashboardTokenTab />,
      visible: true,
    },
    {
      key: "global_activity",
      label: t("token.dashboard.tabs.globalActivity"),
      content: () => <DeFiOrderList page={page} tabName='global_activity' />,
      visible: true,
    },
    {
      key: "exchange",
      label: t("token.dashboard.tabs.exchange"),
      content: <TokenDashboardExchangeTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='tokenDashboard'
      title={t("token.dashboard.title")}
      breadcrumbItems={[
        { label: t("token.dashboard.breadcrumbs.token") },
        { label: t("token.dashboard.breadcrumbs.dashboard") },
      ]}
    >
      <Tabs items={tabs} />
    </PageBase>
  );
};
