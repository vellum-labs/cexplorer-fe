import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";
import type { MiscConstResponseData } from "@/types/miscTypes";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";

interface EpochPotsProps {
  stats: EpochStatsSummary;
  constData?: MiscConstResponseData;
}

export const EpochPots: FC<EpochPotsProps> = ({ stats, constData }) => {
  const treasury = stats?.pots?.treasury;
  const reserves = stats?.pots?.reserves;
  const rewards = stats?.pots?.rewards;
  const depositsStake = stats?.pots?.deposits?.deposits_stake;
  const fees = stats?.pots?.fees;

  const feesForRewards =
    (stats?.pots?.fees ?? 1) *
    (1 - +(constData?.epoch_param?.treasury_growth_rate ?? 0.2));
  const reservesForRewards =
    (stats?.pots?.reserves ?? 1) *
    +(constData?.epoch_param?.monetary_expand_rate ?? 0.003) *
    (1 - +(constData?.epoch_param?.treasury_growth_rate ?? 0.2));

  const rewardsTotal = feesForRewards + reservesForRewards;

  const feesPercentage = (feesForRewards / rewardsTotal) * 100;
  const reservesPercentage = (reservesForRewards / rewardsTotal) * 100;

  const overviewList = [
    {
      label: "Treasury",
      value: (
        <p className='text-text-sm font-medium'>
          <AdaWithTooltip data={treasury ?? 0} />
        </p>
      ),
    },
    {
      label: "Reserves",
      value: (
        <p className='text-text-sm font-medium'>
          <AdaWithTooltip data={reserves ?? 0} />
        </p>
      ),
    },
    {
      label: "Rewards",
      value: (
        <p className='text-text-sm font-medium'>
          <AdaWithTooltip data={rewards} />
        </p>
      ),
    },
    {
      label: "Deposits",
      value: (
        <p className='text-text-sm font-medium'>
          <AdaWithTooltip data={depositsStake} />
        </p>
      ),
    },
    {
      label: "Fees",
      value: (
        <p className='text-text-sm font-medium'>
          <AdaWithTooltip data={fees} />
        </p>
      ),
    },
    {
      label: (
        <Tooltip content='Portion of staking rewards coming from fees vs reserves'>
          <span className='cursor-help'>Fees / Reserves</span>
        </Tooltip>
      ),
      value: (
        <p className='text-text-sm font-medium'>
          {feesPercentage.toFixed(2)}% / {reservesPercentage.toFixed(2)}%
        </p>
      ),
    },
  ];

  return (
    <div className='flex flex-grow basis-[410px] items-stretch md:flex-shrink-0'>
      <OverviewCard title='Pots' overviewList={overviewList} />
    </div>
  );
};
