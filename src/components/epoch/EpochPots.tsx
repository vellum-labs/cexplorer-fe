import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";

interface EpochPotsProps {
  stats: EpochStatsSummary;
}

export const EpochPots: FC<EpochPotsProps> = ({ stats }) => {
  const treasury = stats?.pots?.treasury;
  const reserves = stats?.pots?.reserves;
  const rewards = stats?.pots?.rewards;
  const depositsStake = stats?.pots?.deposits?.deposits_stake;
  const fees = stats?.pots?.fees;
  const epoch = stats?.epoch;

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
      label: "Earned / Treasury",
      value: (() => {
        const earnedTreasuryPercentage = (epoch?.fees / treasury) * 100;

        return (
          <p className='text-text-sm font-medium'>
            {earnedTreasuryPercentage.toFixed(6)}%
          </p>
        );
      })(),
    },
  ];

  return (
    <div className='flex flex-grow basis-[410px] items-stretch md:flex-shrink-0'>
      <OverviewCard title='Pots' overviewList={overviewList} />
    </div>
  );
};
