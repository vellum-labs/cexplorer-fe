import {
  drepVotingActions,
  spoVotingActions,
  ccVotingActions,
  criticalProtocolParameters,
} from "@/constants/governance";

export const shouldDRepVote = (type: string): boolean => {
  return drepVotingActions.includes(type as any);
};

export const hasCriticalParameters = (description?: {
  tag?: string;
  contents?: any[];
}): boolean => {
  if (!description?.contents?.[1]) {
    return false;
  }

  const parameterChanges = description.contents[1];

  if (
    typeof parameterChanges === "object" &&
    parameterChanges !== null &&
    !Array.isArray(parameterChanges)
  ) {
    const changedParams = Object.keys(parameterChanges);
    return changedParams.some(param =>
      criticalProtocolParameters.includes(param as any),
    );
  }

  return false;
};

export const shouldSPOVote = (
  type: string,
  description?: { tag?: string; contents?: any[] },
): boolean => {
  if (spoVotingActions.includes(type as any)) {
    return true;
  }

  if (type === "ParameterChange") {
    return hasCriticalParameters(description);
  }

  return false;
};

export const shouldCCVote = (type: string): boolean => {
  return ccVotingActions.includes(type as any);
};
