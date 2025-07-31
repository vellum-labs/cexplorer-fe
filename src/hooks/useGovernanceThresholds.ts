import { useState } from "react";
import { useFetchThreshold } from "@/services/governance";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { ThresholdPoolList } from "@/types/governanceTypes";

export const useGovernanceThresholds = () => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const query = useFetchThreshold();

  const [includeInactive, setIncludeInactive] = useState(false);

  const drepList = query.data?.data?.drep_list?.data ?? [];

  const filteredDReps = includeInactive
    ? drepList
    : drepList.filter(d => d.is_active);

  const totalDelegatedToDReps = query?.data?.data.epoch_stats.daily.reduce(
    (sum, day) => sum + Number(day?.stat?.drep_distr?.sum ?? 0),
    0,
  );

  const totalDelegatedToAlwaysAbstain =
    query?.data?.data.gov_stat.stake.drep_always_abstain;

  const totalDelegatedToInactiveDreps =
    query?.data?.data.gov_stat.stake.drep_inactive.power;

  const activeVotingStake =
    (totalDelegatedToDReps ?? 0) -
    (totalDelegatedToAlwaysAbstain ?? 0) -
    (totalDelegatedToInactiveDreps ?? 0);

  const activeVotingStakeInactive =
    (totalDelegatedToDReps ?? 0) - (totalDelegatedToAlwaysAbstain ?? 0);

  const ccData = {
    count: query?.data?.data?.gov_committee_detail?.member?.length,
    quorum_numerator:
      query?.data?.data?.gov_committee_detail.committee.quorum_numerator,
    quorum_denominator:
      query?.data?.data?.gov_committee_detail.committee.quorum_denominator,
  };

  const poolsCount = query?.data?.data?.pool_list.count ?? 0;
  const drepsCount = query?.data?.data?.drep_list.count ?? 0;
  const poolList = query?.data?.data?.pool_list ?? ({} as ThresholdPoolList);

  const generateProps = (params, visibility, isSecuryTitle = false) => ({
    params,
    filteredDReps,
    activeVotingStakeInactive,
    activeVotingStake,
    visibility,
    isSecuryTitle,
    epochParam: miscConst?.epoch_param,
    poolsCount,
    drepsCount,
    includeInactive,
    ccData: {
      count: Number(ccData.count),
      quorum_numerator: Number(ccData.quorum_numerator),
      quorum_denominator: Number(ccData.quorum_denominator),
    },
  });

  const voteOfMotionNoConfidenceProps = generateProps(
    {
      cc: null,
      drep: "dvt_motion_no_confidence",
      spo: "pvt_motion_no_confidence",
    },
    { total: true, cc: false, drep: true, spo: true },
  );

  const voteOfCommitteeNormalProps = generateProps(
    {
      cc: null,
      drep: "dvt_committee_normal",
      spo: "pvt_committee_normal",
    },
    { total: true, cc: false, drep: true, spo: true },
  );

  const voteOfCommitteeNoConfidenceProps = generateProps(
    {
      cc: null,
      drep: "dvt_committee_no_confidence",
      spo: "pvt_committee_no_confidence",
    },
    { total: true, cc: false, drep: true, spo: true },
  );

  const voteOfUpdateToConstitutionProps = generateProps(
    {
      cc: null,
      drep: "dvt_update_to_constitution",
      spo: null,
    },
    { total: true, cc: true, drep: true, spo: false },
  );

  const voteOfHardForkInitiationProps = generateProps(
    {
      cc: null,
      drep: "dvt_hard_fork_initiation",
      spo: "pvt_hard_fork_initiation",
    },
    { total: true, cc: true, drep: true, spo: true },
  );

  const voteOfTreasuryWithdrawalProps = generateProps(
    {
      cc: null,
      drep: "dvt_treasury_withdrawal",
      spo: null,
    },
    { total: true, cc: true, drep: true, spo: false },
  );

  const voteOfPPEconomicGroupProps = generateProps(
    {
      cc: null,
      drep: "dvt_p_p_economic_group",
      spo: "pvtpp_security_group",
    },
    { total: true, cc: true, drep: true, spo: true },
    true,
  );

  const voteOfPPTechnicalGroupProps = generateProps(
    {
      cc: null,
      drep: "dvt_p_p_technical_group",
      spo: "pvtpp_security_group",
    },
    { total: true, cc: true, drep: true, spo: true },
    true,
  );

  const voteOfPPNetworkGroupProps = generateProps(
    {
      cc: null,
      drep: "dvt_p_p_network_group",
      spo: "pvtpp_security_group",
    },
    { total: true, cc: true, drep: true, spo: true },
    true,
  );

  const voteOfPPGovGroupProps = generateProps(
    {
      cc: null,
      drep: "dvt_p_p_gov_group",
      spo: "pvtpp_security_group",
    },
    { total: true, cc: true, drep: true, spo: true },
    true,
  );

  return {
    includeInactive,
    setIncludeInactive,
    miscConst,
    query,
    poolList,
    generateProps,
    voteOfMotionNoConfidenceProps,
    voteOfCommitteeNormalProps,
    voteOfCommitteeNoConfidenceProps,
    voteOfUpdateToConstitutionProps,
    voteOfHardForkInitiationProps,
    voteOfTreasuryWithdrawalProps,
    voteOfPPEconomicGroupProps,
    voteOfPPTechnicalGroupProps,
    voteOfPPNetworkGroupProps,
    voteOfPPGovGroupProps,
  };
};
