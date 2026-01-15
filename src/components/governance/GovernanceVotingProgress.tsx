import type { FC } from "react";
import type { GovernanceActionList } from "@/types/governanceTypes";
import {
  shouldDRepVote,
  shouldSPOVote,
  shouldCCVote,
} from "@/utils/governanceVoting";
import { voterRoles } from "@/constants/governance";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GovernanceVotingProgressProps {
  governanceAction: GovernanceActionList;
}

export const GovernanceVotingProgress: FC<GovernanceVotingProgressProps> = ({
  governanceAction,
}) => {
  const { t } = useAppTranslation();
  const roundPercentage = (percent: number): number =>
    Math.round(percent * 100) / 100;

  const getVoteData = (
    votingProcedure: NonNullable<GovernanceActionList["voting_procedure"]>,
    role: string,
  ) => {
    const votes = votingProcedure.filter(item => item?.voter_role === role);
    return votes.reduce(
      (acc, item) => {
        const vote = item?.vote;
        if (vote === "Yes") acc.yes = item?.stat?.stake || item?.count || 0;
        else if (vote === "No") acc.no = item?.stat?.stake || item?.count || 0;
        else if (vote === "Abstain")
          acc.abstain = item?.stat?.stake || item?.count || 0;
        return acc;
      },
      { yes: 0, no: 0, abstain: 0 },
    );
  };

  const calculateVotingProgress = (
    votingProcedure: NonNullable<GovernanceActionList["voting_procedure"]>,
    actionType: string,
    governanceAction: GovernanceActionList,
  ) => {
    const voters = [
      {
        condition:
          shouldCCVote(actionType) && governanceAction?.committee?.member,
        type: "CC",
        role: voterRoles.constitutionalCommittee,
        totalBase: governanceAction?.committee?.member?.length || 0,
        isCountBased: true,
      },
      {
        condition: shouldDRepVote(actionType) && governanceAction?.total?.drep,
        type: "DRep",
        role: voterRoles.drep,
        totalBase:
          (governanceAction?.total?.drep?.stake || 0) +
          (governanceAction?.total?.drep?.drep_always_abstain?.stake || 0) +
          (governanceAction?.total?.drep?.drep_always_no_confidence?.stake ||
            0),
        extraAbstain:
          governanceAction?.total?.drep?.drep_always_abstain?.stake || 0,
        extraNoConfidence:
          governanceAction?.total?.drep?.drep_always_no_confidence?.stake || 0,
        isCountBased: false,
      },
      {
        condition:
          shouldSPOVote(actionType, votingProcedure) &&
          governanceAction?.total?.spo,
        type: "SPO",
        role: voterRoles.spo,
        totalBase: governanceAction?.total?.spo?.stake || 0,
        extraAbstain:
          governanceAction?.total?.spo?.drep_always_abstain?.stake || 0,
        extraNoConfidence:
          governanceAction?.total?.spo?.drep_always_no_confidence?.stake || 0,
        isCountBased: false,
      },
    ];

    return voters
      .filter(voter => voter.condition)
      .map(voter => {
        const { yes, no, abstain } = getVoteData(votingProcedure, voter.role);
        const totalAbstain = abstain + (voter.extraAbstain || 0);
        const totalNo = no + (voter.extraNoConfidence || 0);
        const votingBase = voter.totalBase - totalAbstain;

        const yesPercent =
          votingBase > 0 ? roundPercentage((yes / votingBase) * 100) : 0;
        const noPercent =
          votingBase > 0 ? roundPercentage((totalNo / votingBase) * 100) : 0;
        const notVotedPercent = Math.max(
          0,
          roundPercentage(100 - yesPercent - noPercent),
        );

        return { type: voter.type, yesPercent, noPercent, notVotedPercent };
      });
  };

  const votingProcedure = governanceAction?.voting_procedure || [];
  const actionType = governanceAction?.type || "";

  const progressBars = calculateVotingProgress(
    votingProcedure,
    actionType,
    governanceAction,
  );

  if (progressBars.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-text-xs text-grayTextSecondary'>
        {t("common:governance.voting.noVotingData")}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-0 py-1/2'>
      {progressBars.map((bar, index) => (
        <div key={index} className='flex items-center gap-1'>
          <span className='min-w-[32px] text-text-xs text-grayTextPrimary'>
            {bar.type}
          </span>
          <div className='relative h-1.5 w-16 overflow-hidden rounded-[3px] bg-border'>
            <div
              className='absolute left-0 top-0 h-1.5 bg-[#1296DB]'
              style={{
                width: `${Math.min(Math.max(bar.yesPercent, 0), 100)}%`,
              }}
            />
            <div
              className='absolute top-0 h-1.5 bg-[#D66A10]'
              style={{
                width: `${Math.min(Math.max(bar.noPercent, 0), 100)}%`,
                left: `${Math.min(Math.max(bar.yesPercent, 0), 100)}%`,
              }}
            />
          </div>
          <span className='min-w-[35px] text-right text-text-xs text-grayTextPrimary'>
            {bar.yesPercent.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};
