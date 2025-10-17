import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@/components/global/cards/OverviewStatCard";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TrendingArrow } from "@/components/global/TrendingArrow";
import { colors } from "@/constants/colors";
import type { TreasuryDonationStatsResponse } from "@/types/treasuryTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import { HandCoins } from "lucide-react";

interface Props {
  query: UseQueryResult<TreasuryDonationStatsResponse["data"]>;
}

export const TreasuryDonationOverview = ({ query }: Props) => {
  const data = query.data;
  const allTimeDonations = data?.epoch.reduce((acc, epoch) => {
    return acc + epoch.treasury_donation;
  }, 0);
  const currentEpochDonations =
    data?.epoch[data.epoch.length - 1].treasury_donation ?? 0;
  const previousEpochDonations =
    data?.epoch[data.epoch.length - 2].treasury_donation ?? 0;
  const morePreviousEpochDonations =
    data?.epoch[data.epoch.length - 3].treasury_donation ?? 0;
  const currentEpochChangePercentage = Number(
    (
      ((currentEpochDonations - previousEpochDonations) /
        (previousEpochDonations || 1)) *
      100
    ).toFixed(1),
  );
  const previousEpochChangePercentage = Number(
    (
      ((previousEpochDonations - morePreviousEpochDonations) /
        (morePreviousEpochDonations || 1)) *
      100
    ).toFixed(1),
  );

  return (
    <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile pb-0 lg:flex-row lg:p-desktop lg:pb-0'>
      {query.isLoading ? (
        <>
          <LoadingSkeleton
            height='290px'
            maxHeight='400px'
            rounded='xl'
            className='grow basis-[500px]'
          />
          <LoadingSkeleton height='100px' rounded='xl' className='' />
          <LoadingSkeleton height='100px' rounded='xl' className='' />
        </>
      ) : (
        <>
          <OverviewStatCard
            title='All-time'
            value={<AdaWithTooltip data={allTimeDonations ?? 0} />}
            className='max-h-[140px]'
            icon={<HandCoins color={colors.primary} />}
          />
          <OverviewStatCard
            icon={<HandCoins color={colors.primary} />}
            title='Current Epoch'
            value={
              <div className='flex items-center gap-2'>
                <span>
                  <AdaWithTooltip data={currentEpochDonations ?? 0} />
                </span>
                <span
                  className={`${
                    currentEpochChangePercentage === 0
                      ? "text-text"
                      : currentEpochChangePercentage > 0
                        ? "text-greenText"
                        : "text-redText"
                  }} gap-1/2text-text-sm flex items-center`}
                >
                  <TrendingArrow percentage={currentEpochChangePercentage} />
                  {currentEpochChangePercentage}%
                </span>
              </div>
            }
            className='max-h-[140px]'
          />
          <OverviewStatCard
            title='Previous Epoch'
            icon={<HandCoins color={colors.primary} />}
            value={
              <div className='flex items-center gap-2'>
                <span>
                  <AdaWithTooltip data={previousEpochDonations ?? 0} />
                </span>
                <span
                  className={`${
                    previousEpochChangePercentage === 0
                      ? "text-text"
                      : previousEpochChangePercentage > 0
                        ? "text-greenText"
                        : "text-redText"
                  }} gap-1/2text-text-sm flex items-center`}
                >
                  <TrendingArrow percentage={previousEpochChangePercentage} />
                  {previousEpochChangePercentage}%
                </span>
              </div>
            }
            className='max-h-[140px]'
          />
        </>
      )}
    </div>
  );
};
