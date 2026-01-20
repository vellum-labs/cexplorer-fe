import type { FC } from "react";
import type { GovernanceActionDetail } from "@/types/governanceTypes";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { GovernanceDetailDrepsSubtab } from "../subtabs/GovernanceDetailDrepsSubtab";
import { GovernanceDetailSposSubtab } from "../subtabs/GovernanceDetailSposSubtab";
import { shouldSPOVote } from "@/utils/governanceVoting";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GovernanceDetailNotVotedTabProps {
  id: string;
  governanceAction?: GovernanceActionDetail;
}

export const GovernanceDetailNotVotedTab: FC<
  GovernanceDetailNotVotedTabProps
> = ({ id, governanceAction }) => {
  const { t } = useAppTranslation();
  const governanceActionType = governanceAction?.type ?? "";
  const votingProcedure = governanceAction?.voting_procedure;

  const tabs = [
    {
      key: "dreps",
      label: t("governance.thresholds.drepTitle"),
      content: <GovernanceDetailDrepsSubtab id={id} />,
      visible: true,
    },
    {
      key: "spos",
      label: t("governance.thresholds.spoTitle"),
      content: <GovernanceDetailSposSubtab id={id} />,
      visible: shouldSPOVote(governanceActionType, votingProcedure, governanceAction?.description),
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
