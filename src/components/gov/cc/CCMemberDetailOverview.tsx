import type { CommitteeMember } from "@/types/governanceTypes";
import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

import { useCCMemberDetail } from "@/hooks/details/useCCMemberDetail";

interface CCMemberDetailOverviewProps {
  memberData: CommitteeMember | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const CCMemberDetailOverview: FC<CCMemberDetailOverviewProps> = ({
  memberData,
  isLoading,
  isError,
}) => {
  const { about } = useCCMemberDetail({ memberData });

  if (isLoading) {
    return (
      <LoadingSkeleton
        height="227px"
        rounded="xl"
        className="w-full px-4 py-2"
      />
    );
  }

  if (isError) {
    return null;
  }

  return (
    <OverviewCard title="About" overviewList={about} className="h-full" />
  );
};
