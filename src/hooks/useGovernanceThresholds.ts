import { useFetchThreshold } from "@/services/governance";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { ThresholdPoolList } from "@/types/governanceTypes";

export const useGovernanceThresholds = () => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);
  const query = useFetchThreshold();
  const epochParam = query.data?.data?.params;

  const drepList = query.data?.data?.drep_list?.data ?? [];

  const filteredDReps = drepList;

  const latestStat = query?.data?.data.gov_stat.stat?.[0];

  const totalDelegatedToAlwaysNoConfidence =
    latestStat?.drep_always_no_confidence?.power ?? 0;
  const humanDRepStake = latestStat?.other?.power ?? 0;

  const activeVotingStake = humanDRepStake + totalDelegatedToAlwaysNoConfidence;

  const govCommittee = query?.data?.data?.gov_committee_detail;
  const activeCCMembers =
    govCommittee?.member?.filter(m => !m.de_registration) ?? [];
  const ccData = {
    count: activeCCMembers.length,
    quorum_numerator: govCommittee?.committee?.quorum_numerator ?? 0,
    quorum_denominator: govCommittee?.committee?.quorum_denominator ?? 1,
  };

  const poolsCount = query?.data?.data?.pool_list.count ?? 0;
  const drepsCount = query?.data?.data?.drep_list.count ?? 0;
  const poolList = query?.data?.data?.pool_list ?? ({} as ThresholdPoolList);
  const totalSpoStake = query?.data?.data?.epoch_stats?.stake?.epoch ?? 0;

  const generateProps = (
    params: any,
    visibility: any,
    isSecuryTitle = false,
  ) => ({
    params,
    filteredDReps,
    activeVotingStake,
    visibility,
    isSecuryTitle,
    epochParam,
    poolsCount,
    drepsCount,
    poolList,
    totalSpoStake,
    ccData: {
      count: Number(ccData.count) || 0,
      quorum_numerator: Number(ccData.quorum_numerator) || 0,
      quorum_denominator: Number(ccData.quorum_denominator) || 1,
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
