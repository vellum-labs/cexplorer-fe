import type { OverviewList } from "@/components/global/cards/OverviewCard";
import type {
  PoolDetailResponse,
  PoolDetailResponseData,
} from "@/types/poolTypes";
import type { UseQueryResult } from "@tanstack/react-query";

import PoolSaturation from "@/components/pool/PoolSaturation";
import RoaDiffArrow from "@/components/pool/RoaDiffArrow";

import { useFetchMiscBasic } from "@/services/misc";
import { useElapsedEpochNumber } from "../useElapsedEpochNumber";
import { useMiscConst } from "../useMiscConst";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@/utils/format/format";
import { formatWebsiteUrl } from "@/utils/format/formatWebsiteUrl";
import { poolRewardsRoaDiff } from "@/utils/poolRewardsRoaDiff";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { SafetyLinkModal } from "@/components/global/modals/SafetyLinkModal";

interface UsePoolDetailArgs {
  query: UseQueryResult<PoolDetailResponse, unknown>;
  estimatedBlocks: number;
}

interface UsePoolDetail {
  data: PoolDetailResponseData | undefined;
  aboutList: OverviewList;
  stakeAndPledgeList: OverviewList;
  performanceList: OverviewList;
}

export const usePoolDetail = ({
  estimatedBlocks,
  query,
}: UsePoolDetailArgs): UsePoolDetail => {
  const data = query.data?.data;
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);
  const epochElapsed = useElapsedEpochNumber(miscConst);

  const [linkModal, setLinkModal] = useState<boolean>(false);

  const proratedLuck = data?.epochs[0].data.block
    ? (() => {
        const percent =
          ((data?.blocks?.epoch ?? 0) /
            data?.epochs[0]?.data?.block?.estimated /
            epochElapsed) *
          100;

        return Number.isNaN(percent) ? "-" : percent.toFixed(2) + "%";
      })()
    : "-";

  const lifetimeRoaDiff = poolRewardsRoaDiff(
    data?.stats?.lifetime?.roa ?? 0,
    miscConst,
  );
  const recentRoaDiff = poolRewardsRoaDiff(
    data?.stats?.recent?.roa ?? 0,
    miscConst,
  );

  let pledgeLeverage = 0;
  const pledge = data?.pool_update.live.pledge;

  if (pledge && pledge > 0) {
    pledgeLeverage = Math.round(
      (data?.live_stake ?? 0) / (pledge > 0 ? pledge : 1),
    );
  }

  const aboutList: OverviewList = [
    { label: "Name", value: data?.pool_name.name },
    { label: "Ticker", value: data?.pool_name.ticker },
    {
      label: "Pool ID",
      value: (
        <span className='flex items-center gap-1'>
          {formatString(data?.pool_id || "", "long")}
          <Copy copyText={data?.pool_id} />
        </span>
      ),
    },
    {
      label: "Created",
      value:
        data?.registered && format(parseISO(data?.registered), "dd.MM.yyyy"),
    },
    { label: "Delegators", value: formatNumber(data?.delegators) },
    {
      label: "Website",
      value: (
        <>
          <a
            className='cursor-pointer break-all text-primary'
            href={data?.pool_name.homepage}
            title={data?.pool_name?.homepage || ""}
            onClick={e => {
              e.preventDefault();
              setLinkModal(true);
            }}
          >
            {formatWebsiteUrl(data?.pool_name.homepage)}
          </a>
          {linkModal && (
            <SafetyLinkModal
              url={data?.pool_name.homepage}
              onClose={() => setLinkModal(false)}
            />
          )}
        </>
      ),
    },
  ];

  const stakeAndPledgeList: OverviewList = [
    {
      label: "Saturation",
      value: <PoolSaturation live_stake={data?.live_stake} />,
    },
    {
      label: "Live Stake",
      value: <AdaWithTooltip data={data?.live_stake || 0} />,
    },
    {
      label: "Active Stake",
      value: <AdaWithTooltip data={data?.active_stake || 0} />,
    },
    {
      label: "Declared Pledge",
      value: <AdaWithTooltip data={data?.pool_update?.active?.pledge ?? 0} />,
    },
    {
      label: "Active Pledge",
      value: <AdaWithTooltip data={data?.pledged ?? 0} />,
    },
    { label: "Pledge Leverage", value: pledgeLeverage },
    {
      label: "Margin Fee",
      value: ((data?.pool_update?.active?.margin ?? 0) * 100).toFixed(2) + "%",
    },
    {
      label: "Fixed Fee",
      value: (
        <AdaWithTooltip data={data?.pool_update?.active?.fixed_cost ?? 0} />
      ),
    },
  ];

  const performanceList: OverviewList = [
    {
      label: "Recent ROA",
      value: data?.stats?.recent?.roa ? (
        <div className='flex items-center gap-1/2'>
          <span>{data?.stats?.recent?.roa.toFixed(2) + "%"}</span>
          <RoaDiffArrow color={recentRoaDiff} size={22} />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: "Lifetime ROA",
      value: data?.stats.lifetime.roa ? (
        <div className='flex items-center gap-1/2'>
          <span>{data?.stats.lifetime.roa.toFixed(2) + "%"}</span>
          <RoaDiffArrow color={lifetimeRoaDiff} size={22} />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: "Blocks in Epoch",
      value: formatNumber(data?.blocks?.epoch),
    },
    {
      label: "Estimated Blocks",
      value: formatNumber(Math.round(estimatedBlocks)),
    },
    {
      label: "Prorated Luck",
      value: proratedLuck,
    },
    {
      label: "Blocks Lifetime",
      value: formatNumber(data?.blocks?.total ?? 0),
    },
    {
      label: "Lifetime Luck",
      value: ((data?.stats?.lifetime.luck ?? 0) * 100).toFixed(2) + "%",
    },
  ];

  return {
    data,
    aboutList,
    performanceList,
    stakeAndPledgeList,
  };
};
