import type { FC } from "react";
import type { GovernanceActionDetail } from "@/types/governanceTypes";

import Tabs from "@/components/global/Tabs";
import { GovernanceDetailDrepsSubtab } from "../subtabs/GovernanceDetailDrepsSubtab";
import { GovernanceDetailSposSubtab } from "../subtabs/GovernanceDetailSposSubtab";
import { shouldSPOVote } from "@/utils/governanceVoting";

interface GovernanceDetailNotVotedTabProps {
  id: string;
  governanceAction?: GovernanceActionDetail;
}

export const GovernanceDetailNotVotedTab: FC<
  GovernanceDetailNotVotedTabProps
> = ({ id, governanceAction }) => {
  const governanceActionType = governanceAction?.type ?? "";
  const votingProcedure = governanceAction?.voting_procedure;

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
      visible: shouldSPOVote(governanceActionType, votingProcedure),
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
