import type { CommitteeMember } from "@/types/governanceTypes";
import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

import { useCCMemberDetail } from "@/hooks/details/useCCMemberDetail";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface CCMemberDetailOverviewProps {
  memberData: CommitteeMember | undefined;
  isLoading: boolean;
  isError: boolean;
  lastVoteTime?: string;
}

export const CCMemberDetailOverview: FC<CCMemberDetailOverviewProps> = ({
  memberData,
  isLoading,
  isError,
  lastVoteTime,
}) => {
  const { t } = useAppTranslation();
  const { about, governance } = useCCMemberDetail({ memberData, lastVoteTime });

  if (isLoading) {
    return (
      <div className='flex flex-col gap-2 xl:flex-row'>
        <LoadingSkeleton
          height='227px'
          rounded='xl'
          className='w-full px-4 py-2 xl:flex-1'
        />
        <LoadingSkeleton
          height='450px'
          rounded='xl'
          className='w-full px-4 py-2 xl:w-[450px]'
        />
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2 xl:flex-row'>
      <div className='flex-1'>
        <OverviewCard
          title={t("gov.cc.about")}
          overviewList={about}
          className='h-full'
        />
      </div>
      <div className='w-full xl:w-[450px]'>
        <OverviewCard
          title={t("gov.cc.governance")}
          overviewList={governance}
          className='h-full'
        />
      </div>
    </div>
  );
};
