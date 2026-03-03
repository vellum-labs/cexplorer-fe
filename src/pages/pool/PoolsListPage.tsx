import { Tabs } from "@vellumlabs/cexplorer-sdk";
import PoolListTab from "@/components/pool/tabs/PoolListTab";
import PoolAnalyticsTab from "@/components/pool/tabs/PoolAnalyticsTab";
import type { FC } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { PageBase } from "@/components/global/pages/PageBase";

interface PoolListProps {
  watchlist?: boolean;
}

const PoolListPage: FC<PoolListProps> = ({ watchlist }) => {
  const { t } = useAppTranslation("pages");

  const tabs = [
    {
      key: "list",
      label: t("pools.tabs.list"),
      content: <PoolListTab watchlist={watchlist} />,
      visible: true,
    },
    {
      key: "analytics",
      label: t("pools.tabs.analytics"),
      content: <PoolAnalyticsTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='poolsList'
      title={t("pools.cardanoStakePools")}
      breadcrumbItems={[{ label: t("pools.title") }]}
    >
      <Tabs items={tabs} wrapperClassname='mt-0' />
    </PageBase>
  );
};

export default PoolListPage;
