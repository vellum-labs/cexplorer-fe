import type { FC } from "react";

import { PoolIssuesAnalytics } from "@/components/analytics/pool/tabs/PoolIssuesAnalytics";
import { AveragePool } from "@/components/analytics/pool/tabs/AveragePool";
import Tabs from "@/components/global/Tabs";
import { PageBase } from "@/components/global/pages/PageBase";

export const PoolAnalytics: FC = () => {
  const tabs = [
    {
      key: "pool_issues",
      label: "Pool issues",
      content: <PoolIssuesAnalytics />,
      visible: true,
    },
    {
      key: "average_pools",
      label: "Average pools",
      content: <AveragePool />,
      visible: true,
    },
  ];

  return (
    <PageBase
      title='Cardano pool analytics'
      breadcrumbItems={[
        { label: "Analytics", link: "/analytics" },
        { label: "Pool" },
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
