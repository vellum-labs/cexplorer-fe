import { drepVotingActions, spoVotingActions, ccVotingActions } from "@/constants/governance";

/**
 * Determines if DReps should vote on a governance action type
 */
export const shouldDRepVote = (type: string): boolean => {
  return drepVotingActions.includes(type as any);
};

/**
 * Determines if SPOs should vote on a governance action type
 */
export const shouldSPOVote = (type: string): boolean => {
  return spoVotingActions.includes(type as any);
};

/**
 * Determines if Constitutional Committee should vote on a governance action type
 */
export const shouldCCVote = (type: string): boolean => {
  return ccVotingActions.includes(type as any);
};