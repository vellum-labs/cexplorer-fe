import type { FC } from "react";
import type { GovernanceActionList } from "@/types/governanceTypes";
import { useThemeStore } from "@/stores/themeStore";

interface GovernanceVotingProgressProps {
  governanceAction: GovernanceActionList;
}

export const GovernanceVotingProgress: FC<GovernanceVotingProgressProps> = ({
  governanceAction,
}) => {
  const { theme } = useThemeStore();
  // Helper function to determine which voter types should vote for this action type
  const shouldDRepVote = (type: string): boolean => {
    const supported = [
      "NoConfidence",
      "NewCommittee", 
      "NewConstitution",
      "HardForkInitiation",
      "ParameterChange",
      "TreasuryWithdrawals",
      "InfoAction",
    ];
    return supported.includes(type);
  };

  const shouldSPOVote = (type: string): boolean => {
    const supported = [
      "NoConfidence",
      "NewCommittee",
      "HardForkInitiation", 
      "InfoAction",
    ];
    return supported.includes(type);
  };

  const shouldCCVote = (type: string): boolean => {
    // CC votes on all governance actions except NoConfidence and NewCommittee
    return type !== "NoConfidence" && type !== "NewCommittee";
  };

  // Helper function to calculate stake from voting procedure
  const calculateStake = (votingProcedure: NonNullable<GovernanceActionList['voting_procedure']>, voterRole: string, voteType?: string) => {
    return votingProcedure
      .filter(item => item?.voter_role === voterRole && (voteType ? item?.vote === voteType : true))
      .reduce((sum, item) => sum + (item?.stat?.stake || 0), 0);
  };

  const votingProcedure = governanceAction?.voting_procedure || [];
  const actionType = governanceAction?.type || "";

  const progressBars: Array<{
    type: string;
    yesPercent: number;
  }> = [];

  // Constitutional Committee Progress (if they vote)
  if (shouldCCVote(actionType) && governanceAction?.committee?.member) {
    const totalCCMembers = governanceAction.committee.member.length;
    let yesCount = 0, abstainCount = 0;
    
    votingProcedure.forEach(item => {
      if (item?.voter_role === "ConstitutionalCommittee") {
        if (item.vote === "Yes") yesCount = item.count || 0;
        else if (item.vote === "Abstain") abstainCount = item.count || 0;
      }
    });
    
    // For CC: abstain votes lower the ceiling, so denominator = total - abstain
    const votingBase = totalCCMembers - abstainCount;
    
    if (votingBase > 0) {
      const yesPercent = (yesCount / votingBase) * 100;
      progressBars.push({
        type: "CC",
        yesPercent: Math.round(yesPercent * 100) / 100,
      });
    } else if (abstainCount === totalCCMembers) {
      progressBars.push({
        type: "CC",
        yesPercent: 0,
      });
    }
  }

  // DReps Progress (if they vote)
  if (shouldDRepVote(actionType) && governanceAction?.total?.drep) {
    const { drep } = governanceAction.total;
    const yesStake = calculateStake(votingProcedure, "DRep", "Yes");
    
    const totalStake = 
      (drep.stake || 0) +
      (drep.drep_always_abstain?.stake || 0) +
      (drep.drep_always_no_confidence?.stake || 0);

    const abstainStake = 
      calculateStake(votingProcedure, "DRep", "Abstain") + 
      (drep.drep_always_abstain?.stake || 0);
    
    // DRep voting stake excludes abstain stake
    const votingStake = totalStake - abstainStake;
    const yesPercent = votingStake > 0 ? (yesStake / votingStake) * 100 : 0;

    progressBars.push({
      type: "DRep",
      yesPercent: Math.round(yesPercent * 100) / 100,
    });
  }

  // SPOs Progress (if they vote)
  if (shouldSPOVote(actionType) && governanceAction?.total?.spo) {
    const { spo } = governanceAction.total;
    const yesStake = calculateStake(votingProcedure, "SPO", "Yes");
    const abstainStake = calculateStake(votingProcedure, "SPO", "Abstain");
    
    // SPO voting stake excludes abstain stake  
    const votingStake = (spo.stake || 0) - abstainStake;
    const yesPercent = votingStake > 0 ? (yesStake / votingStake) * 100 : 0;

    progressBars.push({
      type: "SPO", 
      yesPercent: Math.round(yesPercent * 100) / 100,
    });
  }

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