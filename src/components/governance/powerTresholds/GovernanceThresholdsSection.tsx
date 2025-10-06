import type { FC } from "react";
import type { ThresholdPoolList } from "@/types/governanceTypes";
import { TotalThresholdChart } from "./TotalThresholdChart";
import { CCThresholdChart } from "./CCThresholdChart";
import { DRepThresholdChart } from "./DRepThresholdChart";
import { SPOThresholdChart } from "./SPOThresholdChart";

interface GovernanceThresholdsSectionProps {
  thresholdProps: {
    epochParam: any;
    poolsCount: number;
    drepsCount: number;
    ccData: {
      count: number;
      quorum_numerator: number;
      quorum_denominator: number;
    };
    isSecuryTitle: boolean;
    visibility: {
      total: boolean;
      cc: boolean;
      drep: boolean;
      spo: boolean;
    };
    activeVotingStake: number;
    filteredDReps: any[];
    params: {
      cc: null | string;
      drep: null | string;
      spo: null | string;
    };
    poolList: ThresholdPoolList;
    totalSpoStake: number;
  };
}

export const GovernanceThresholdsSection: FC<
  GovernanceThresholdsSectionProps
> = ({ thresholdProps }) => {
  const {
    epochParam,
    ccData,
    isSecuryTitle,
    visibility,
    activeVotingStake,
    filteredDReps,
    params,
  } = thresholdProps;

  const ccCount =
    visibility.cc && ccData.quorum_denominator > 0
      ? Math.ceil(
          (ccData.count || 0) *
            (ccData.quorum_numerator / ccData.quorum_denominator),
        )
      : 0;

  let drepCount = 0;
  if (visibility.drep && params.drep && epochParam?.[params.drep]) {
    const threshold = epochParam[params.drep];
    const votingStake = activeVotingStake || 0;
    const requiredStake = votingStake > 0 ? votingStake * threshold : 0;

    const sortedDReps = [...filteredDReps].sort(
      (a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0),
    );

    let accumulated = 0;
    for (const drep of sortedDReps) {
      if (accumulated >= requiredStake) break;
      accumulated += Number(drep.amount ?? 0);
      drepCount++;
    }
  }

  let spoCount = 0;
  if (
    visibility.spo &&
    thresholdProps.poolList &&
    thresholdProps.totalSpoStake &&
    params.spo &&
    epochParam?.[params.spo]
  ) {
    const threshold = epochParam[params.spo];
    const pools = thresholdProps.poolList.data ?? [];
    const totalStake = thresholdProps.totalSpoStake || 0;
    const requiredStake = totalStake > 0 ? totalStake * threshold : 0;

    const sortedPools = [...pools].sort(
      (a, b) => Number(b.live_stake ?? 0) - Number(a.live_stake ?? 0),
    );

    let accumulated = 0;
    for (const pool of sortedPools) {
      if (accumulated >= requiredStake) break;
      accumulated += Number(pool.live_stake ?? 0);
      spoCount++;
    }
  }

  return (
    <section className='w-full rounded-l p-2'>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-4'>
        <TotalThresholdChart
          chartProps={{
            ...thresholdProps,
            ccCount,
            drepCount,
            spoCount,
          }}
        />
        <CCThresholdChart
          chartProps={{
            ccData,
            visibility: visibility.cc,
            params: params.cc,
          }}
        />
        <DRepThresholdChart
          chartProps={{
            epochParam,
            visibility: visibility.drep,
            activeVotingStake,
            filteredDReps,
            params: params.drep,
          }}
        />
        <SPOThresholdChart
          chartProps={{
            epochParam,
            visibility: visibility.spo,
            params: params.spo,
            isSecuryTitle,
            poolList: thresholdProps.poolList,
            totalSpoStake: thresholdProps.totalSpoStake,
          }}
        />
      </div>
    </section>
  );
};
