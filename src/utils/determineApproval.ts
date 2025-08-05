export const determineApproval = (
  epochParams: Record<string, any>,
  committeeMembers: any[] = [],
  committeeData: any,
  type: string,
  drepsVoted: number,
  sposVoted: number,
): {
  dRepsApproved: boolean;
  sPOsApproved: boolean;
  constitutionalCommitteeApproved: boolean;
  drepThreshold: number;
  spoThreshold: number;
  ccThreshold: number;
} => {
  const drepThreshold = (() => {
    switch (type) {
      case "TreasuryWithdrawals":
        return epochParams.dvt_treasury_withdrawal ?? 0.67;
      case "HardForkInitiation":
        return epochParams.dvt_hard_fork_initiation ?? 0.6;
      case "NoConfidence":
        return epochParams.dvt_motion_no_confidence ?? 0.67;
      case "NewCommittee":
        return epochParams.dvt_committee_no_confidence ?? 0.6;
      case "NewConstitution":
        return epochParams.dvt_update_to_constitution ?? 0.75;
      case "ParameterChange":
        return epochParams.dvt_p_param_update ?? 0.67;
      default:
        return 1;
    }
  })();

  const spoThreshold = (() => {
    switch (type) {
      case "TreasuryWithdrawals":
        return epochParams.pvt_treasury_withdrawal ?? 0.67;
      case "HardForkInitiation":
        return epochParams.pvt_hard_fork_initiation ?? 0.51;
      case "NoConfidence":
        return epochParams.pvt_motion_no_confidence ?? 0.51;
      case "NewCommittee":
        return epochParams.pvt_committee_no_confidence ?? 0.51;
      case "NewConstitution":
        return epochParams.pvt_update_to_constitution ?? 0.67;
      case "ParameterChange":
        return epochParams.pvt_p_param_update ?? 0.51;
      default:
        return 1;
    }
  })();

  const dRepsApproved = drepsVoted > 0 ? drepsVoted >= drepThreshold : false;

  const sPOsApproved = sposVoted > 0 ? sposVoted >= spoThreshold : false;

  const ccQuorum = committeeData?.quorum;
  const ccThreshold =
    ccQuorum && ccQuorum.denuminator > 0
      ? ccQuorum.numerator / ccQuorum.denuminator
      : 0.67;

  const yesVotes = committeeMembers.filter(m => m?.vote === "Yes").length;
  const totalMembers = committeeMembers.length;
  const constitutionalCommitteeApproved =
    totalMembers > 0 ? yesVotes / totalMembers >= ccThreshold : false;

  return {
    dRepsApproved,
    sPOsApproved,
    constitutionalCommitteeApproved,
    drepThreshold,
    spoThreshold,
    ccThreshold,
  };
};
