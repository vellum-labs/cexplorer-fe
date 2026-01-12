import type { FC } from "react";

import { PoolIssuesAnalytics } from "@/components/analytics/pool/tabs/PoolIssuesAnalytics";
import { AveragePool } from "@/components/analytics/pool/tabs/AveragePool";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const PoolAnalytics: FC = () => {
  const { t } = useAppTranslation();

  const tabs = [
    {
      key: "pool_issues",
      label: t("tabs.analytics.poolIssues"),
      content: <PoolIssuesAnalytics />,
      visible: true,
    },
    {
      key: "average_pools",
      label: t("tabs.analytics.averagePools"),
      content: <AveragePool />,
      visible: true,
    },
  ];

  return (
    <PageBase
      title={t("pages:poolAnalytics.title")}
      breadcrumbItems={[
        { label: t("pages:breadcrumbs.analytics"), link: "/analytics" },
        { label: t("pages:breadcrumbs.pool") },
      ]}
      metadataTitle='poolAnalytics'
    >
      <Tabs
        items={tabs}
        forceDropdownVerticalPosition='down'
        wrapperClassname='mt-0'
      />
    </PageBase>
  );
};
