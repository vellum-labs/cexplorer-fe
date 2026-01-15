import {
  drepVotingActions,
  spoVotingActions,
  ccVotingActions,
} from "@/constants/governance";

export const shouldDRepVote = (type: string): boolean => {
  return drepVotingActions.includes(type as any);
};

export const shouldSPOVote = (
  type: string,
  votingProcedure?: any[],
): boolean => {
  if (spoVotingActions.includes(type as any)) {
    return true;
  }

  // ParameterChange - Security Parameter - with actual SPO votes present
  if (type === "ParameterChange" && votingProcedure?.length) {
    const hasSPOVotes = votingProcedure.some(
      vote => vote?.voter_role === "SPO",
    );
    return hasSPOVotes;
  }

  return false;
};

export const shouldCCVote = (type: string): boolean => {
  return ccVotingActions.includes(type as any);
};
