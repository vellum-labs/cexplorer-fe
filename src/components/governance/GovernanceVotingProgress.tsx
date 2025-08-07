import type { FC } from "react";
import type { GovernanceActionList } from "@/types/governanceTypes";
import { shouldDRepVote, shouldSPOVote, shouldCCVote } from "@/utils/governanceVoting";
import { voterRoles } from "@/constants/governance";

interface GovernanceVotingProgressProps {
  governanceAction: GovernanceActionList;
}

export const GovernanceVotingProgress: FC<GovernanceVotingProgressProps> = ({
  governanceAction,
}) => {

  // Helper function to calculate stake from voting procedure
  const calculateStake = (votingProcedure: NonNullable<GovernanceActionList['voting_procedure']>, voterRole: string, voteType?: string) => {
    return votingProcedure
      .filter(item => item?.voter_role === voterRole && (voteType ? item?.vote === voteType : true))
      .reduce((sum, item) => sum + (item?.stat?.stake || 0), 0);
  };

  // Function to calculate all voting progress states at once
  const calculateAllVotingProgress = (
    votingProcedure: NonNullable<GovernanceActionList['voting_procedure']>,
    actionType: string,
    governanceAction: GovernanceActionList
  ): Array<{ type: string; yesPercent: number }> => {
    const results: Array<{ type: string; yesPercent: number }> = [];

    // Constitutional Committee Progress
    if (shouldCCVote(actionType) && governanceAction?.committee?.member) {
      let yesCount = 0, abstainCount = 0;

      votingProcedure.forEach(item => {
        if (item?.voter_role === voterRoles.constitutionalCommittee) {
          if (item.vote === "Yes") yesCount = item.count || 0;
          else if (item.vote === "Abstain") abstainCount = item.count || 0;
        }
      });

      const votingBase = governanceAction.committee.member.length - abstainCount;
      
      if (votingBase > 0) {
        const ccProgress = (yesCount / votingBase) * 100;
        results.push({
          type: "CC",
          yesPercent: roundPercentage(ccProgress),
        });
      } else if (abstainCount === governanceAction.committee.member.length) {
        results.push({
          type: "CC", 
          yesPercent: 0,
        });
      }
    }

    // DReps Progress
    if (shouldDRepVote(actionType) && governanceAction?.total?.drep) {
      const drepData = governanceAction.total.drep;
      const yesStake = calculateStake(votingProcedure, voterRoles.drep, "Yes");
      
      const totalStake = 
        (drepData.stake || 0) +
        (drepData.drep_always_abstain?.stake || 0) +
        (drepData.drep_always_no_confidence?.stake || 0);

      const abstainStake = 
        calculateStake(votingProcedure, voterRoles.drep, "Abstain") + 
        (drepData.drep_always_abstain?.stake || 0);
      
      const votingStake = totalStake - abstainStake;
      if (votingStake > 0) {
        const drepProgress = (yesStake / votingStake) * 100;
        results.push({
          type: "DRep",
          yesPercent: roundPercentage(drepProgress),
        });
      } else {
        results.push({
          type: "DRep",
          yesPercent: 0,
        });
      }
    }

    // SPOs Progress
    if (shouldSPOVote(actionType) && governanceAction?.total?.spo) {
      const spoData = governanceAction.total.spo;
      const yesStake = calculateStake(votingProcedure, voterRoles.spo, "Yes");
      const abstainStake = calculateStake(votingProcedure, voterRoles.spo, "Abstain");
      
      const votingStake = (spoData.stake || 0) - abstainStake;
      if (votingStake > 0) {
        const spoProgress = (yesStake / votingStake) * 100;
        results.push({
          type: "SPO",
          yesPercent: roundPercentage(spoProgress),
        });
      } else {
        results.push({
          type: "SPO",
          yesPercent: 0,
        });
      }
    }

    return results;
  };

  // Helper function to round percentage
  const roundPercentage = (percent: number): number => {
    return Math.round(percent * 100) / 100;
  };

  const votingProcedure = governanceAction?.voting_procedure || [];
  const actionType = governanceAction?.type || "";

  const progressBars = calculateAllVotingProgress(votingProcedure, actionType, governanceAction);

  if (progressBars.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-grayTextSecondary">
        No voting data
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 py-1">
      {progressBars.map((bar, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-xs text-grayTextPrimary min-w-[32px]">
            {bar.type}
          </span>
          <div 
            className="relative h-1.5 w-16 overflow-hidden rounded-[3px] bg-[#D66A10]"
          >
            <div
              className="absolute top-0 left-0 h-1.5 bg-[#1296DB]"
              style={{
                width: `${Math.min(Math.max(bar.yesPercent, 0), 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-grayTextPrimary min-w-[35px] text-right">
            {bar.yesPercent.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};