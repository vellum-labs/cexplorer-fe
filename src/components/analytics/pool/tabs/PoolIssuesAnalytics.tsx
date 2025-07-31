import type { FC } from "react";

import Tabs from "@/components/global/Tabs";
import { PoolIssuesMissedBlocks } from "../subTabs/PoolIssuesMissedBlocks";

export const PoolIssuesAnalytics: FC = () => {
  const tabs = [
    {
      key: "missed_blocks",
      label: "Missed Blocks",
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
