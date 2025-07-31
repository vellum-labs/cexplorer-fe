import type { FC } from "react";

import Tabs from "@/components/global/Tabs";
import { GovernanceDetailDrepsSubtab } from "../subtabs/GovernanceDetailDrepsSubtab";
import { GovernanceDetailSposSubtab } from "../subtabs/GovernanceDetailSposSubtab";

interface GovernanceDetailNotVotedTabProps {
  id: string;
}

export const GovernanceDetailNotVotedTab: FC<
  GovernanceDetailNotVotedTabProps
> = ({ id }) => {
  const tabs = [
    {
      key: "dreps",
      label: "DReps",
      content: <GovernanceDetailDrepsSubtab id={id} />,
      visible: true,
    },
    {
      key: "spos",
      label: "SPOs",
      content: <GovernanceDetailSposSubtab id={id} />,
      visible: true,
    },
  ];

  return (
    <Tabs
      tabParam='subTab'
      withPadding={false}
      withMargin={false}
      items={tabs}
    />
  );
};
