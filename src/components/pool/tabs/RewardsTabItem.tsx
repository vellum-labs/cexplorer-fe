import type { PoolDetailResponse } from "@/types/poolTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import type { FC } from "react";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { getRouteApi } from "@tanstack/react-router";
import PoolRewardsGraph from "../graphs/PoolRewardsGraph";
import PoolRewardsTable from "../PoolRewardsTable";
import { usePoolRewardGraph } from "@/hooks/pool/usePoolRewardGraph";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface RewardsTabItemProps {
  query: UseQueryResult<PoolDetailResponse, unknown>;
}

const RewardsTabItem: FC<RewardsTabItemProps> = ({ query }) => {
  const { t } = useAppTranslation("pages");
  const data = query.data?.data;

  const currentEpochStake = data?.live_stake;
  const currentActiveStake = data?.active_stake;

  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();
  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);

  const { epochs, leaderLovelace, memberLovelace, membetPct, operatorPct } =
    usePoolRewardGraph(id, miscConst);

  return (
    <div>
      <h2 className='mb-1'>{t("pools.detailPage.tabs.rewards")}</h2>
      <PoolRewardsGraph
        epochs={epochs}
        leaderLovelace={leaderLovelace}
        memberLovelace={memberLovelace}
        membetPct={membetPct}
        operatorPct={operatorPct}
      />
      <div className='flex flex-col items-end gap-2'>
        <PoolRewardsTable
          poolId={id}
          miscConst={miscConst}
          currentActiveStake={currentActiveStake}
          currentEpochStake={currentEpochStake}
        />
      </div>
    </div>
  );
};

export default RewardsTabItem;
