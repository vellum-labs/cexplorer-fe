import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import { useFetchGovernanceAction } from "@/services/governance";
import { GovernanceTimelineGraph } from "../GovernanceTimelineGraph";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

interface GovernanceTimelineTabProps {
  miscConst: MiscConstResponseData | undefined;
}

export const GovernanceTimelineTab: FC<GovernanceTimelineTabProps> = ({
  miscConst,
}) => {
  const govActionQuery = useFetchGovernanceAction(20, 0, "All");

  const items = govActionQuery.data?.pages.flatMap(page => page.data.data);

  if (govActionQuery.isLoading || govActionQuery.isFetching) {
    return (
      <div className='mt-2'>
        <LoadingSkeleton width='100%' height='500px' rounded='xl' />
      </div>
    );
  }

  return (
    <div className='mt-2'>
      <GovernanceTimelineGraph
        items={items ?? []}
        currentEpoch={miscConst?.epoch?.no ?? 0}
        epochStartTime={miscConst?.epoch?.start_time ?? ""}
      />
    </div>
  );
};
