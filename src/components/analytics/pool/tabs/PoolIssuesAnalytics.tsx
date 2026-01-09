import type { FC } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { PoolIssuesMissedBlocks } from "../subTabs/PoolIssuesMissedBlocks";

export const PoolIssuesAnalytics: FC = () => {
  const { t } = useAppTranslation("common");
  const tabs = [
    {
      key: "missed_blocks",
      label: t("analytics.missedBlocksTab"),
      content: <PoolIssuesMissedBlocks />,
      visible: true,
    },
  ];

  return (
    <Tabs
      items={tabs}
      tabParam='subTab'
      withPadding={false}
      wrapperClassname='mt-0'
    />
  );
};
