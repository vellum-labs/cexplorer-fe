import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TrendingArrow } from "@vellumlabs/cexplorer-sdk";
import { colors } from "@/constants/colors";
import type { TreasuryDonationStatsResponse } from "@/types/treasuryTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import { HandCoins } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  query: UseQueryResult<TreasuryDonationStatsResponse["data"]>;
}

export const TreasuryDonationOverview = ({ query }: Props) => {
  const { t } = useAppTranslation("common");
  const data = query.data;
  const currentEpochNo = data?.epoch[0]?.epoch_no ?? 0;
  const findEpoch = (epochNo: number) =>
    data?.epoch.find(e => e.epoch_no === epochNo);
  const allTimeDonations = data?.stat?.total ?? 0;
  const currentEpochDonations =
    findEpoch(currentEpochNo)?.treasury_donation ?? 0;
  const previousEpochDonations =
    findEpoch(currentEpochNo - 1)?.treasury_donation ?? 0;
  const morePreviousEpochDonations =
    findEpoch(currentEpochNo - 2)?.treasury_donation ?? 0;
  const currentEpochChangePercentage =
    previousEpochDonations > 0
      ? Number(
          (
            ((currentEpochDonations - previousEpochDonations) /
              previousEpochDonations) *
            100
          ).toFixed(1),
        )
      : 0;
  const previousEpochChangePercentage =
    morePreviousEpochDonations > 0
      ? Number(
          (
            ((previousEpochDonations - morePreviousEpochDonations) /
              morePreviousEpochDonations) *
            100
          ).toFixed(1),
        )
      : 0;

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
            title={t("treasury.overview.allTime")}
            value={<AdaWithTooltip data={allTimeDonations ?? 0} />}
            className='max-h-[140px]'
            icon={<HandCoins color={colors.primary} />}
          />
          <OverviewStatCard
            icon={<HandCoins color={colors.primary} />}
            title={t("treasury.overview.currentEpoch")}
            value={
              <div className='flex items-center gap-2'>
                <span>
                  <AdaWithTooltip data={currentEpochDonations ?? 0} />
                </span>
                <span className='flex items-center gap-1/2 text-text-md text-text'>
                  <TrendingArrow percentage={currentEpochChangePercentage} />
                  {currentEpochChangePercentage}%
                </span>
              </div>
            }
            className='max-h-[140px]'
          />
          <OverviewStatCard
            title={t("treasury.overview.previousEpoch")}
            icon={<HandCoins color={colors.primary} />}
            value={
              <div className='flex items-center gap-2'>
                <span>
                  <AdaWithTooltip data={previousEpochDonations ?? 0} />
                </span>
                <span className='flex items-center gap-1/2 text-text-md text-text'>
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
