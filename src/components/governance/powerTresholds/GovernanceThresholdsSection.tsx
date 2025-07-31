import type { FC } from "react";
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
    includeInactive: boolean;
    isSecuryTitle: boolean;
    visibility: {
      total: boolean;
      cc: boolean;
      drep: boolean;
      spo: boolean;
    };
    activeVotingStake: number;
    activeVotingStakeInactive: number;
    filteredDReps: any[];
    params: {
      cc: null | string;
      drep: null | string;
      spo: null | string;
    };
  };
}

export const GovernanceThresholdsSection: FC<
  GovernanceThresholdsSectionProps
> = ({ thresholdProps }) => {
  const {
    epochParam,
    poolsCount,
    drepsCount,
    ccData,
    includeInactive,
    isSecuryTitle,
    visibility,
    activeVotingStake,
    filteredDReps,
    activeVotingStakeInactive,
    params,
  } = thresholdProps;

  return (
    <section className='w-full rounded-xl p-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <TotalThresholdChart chartProps={thresholdProps} />
        <CCThresholdChart
          chartProps={{
            epochParam,
            ccData,
            visibility: visibility.cc,
            params: params.cc,
          }}
        />
        <DRepThresholdChart
          chartProps={{
            epochParam,
            drepsCount,
            includeInactive,
            visibility: visibility.drep,
            activeVotingStake,
            filteredDReps,
            activeVotingStakeInactive,
            params: params.drep,
          }}
        />
        <SPOThresholdChart
          chartProps={{
            epochParam,
            poolsCount,
            visibility: visibility.spo,
            params: params.spo,
            isSecuryTitle,
          }}
        />
      </div>
    </section>
  );
};
