import type { OverviewList } from "@vellumlabs/cexplorer-sdk";
import type {
  PoolDetailResponse,
  PoolDetailResponseData,
} from "@/types/poolTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import type { MiscConstResponseData } from "@/types/miscTypes";

import { PoolSaturation } from "@/components/pool/PoolSaturation";
import RoaDiffArrow from "@/components/pool/RoaDiffArrow";

import { useFetchMiscBasic } from "@/services/misc";
import { useElapsedEpochNumber } from "../useElapsedEpochNumber";
import { useMiscConst } from "../useMiscConst";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { formatWebsiteUrl } from "@/utils/format/formatWebsiteUrl";
import { poolRewardsRoaDiff } from "@/utils/poolRewardsRoaDiff";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { DelegatorsLabel } from "@vellumlabs/cexplorer-sdk";
import { buildSocialIcons } from "@/utils/buildSocialIcons";

interface UsePoolDetailArgs {
  query: UseQueryResult<PoolDetailResponse, unknown>;
  estimatedBlocks: number;
  miscConst?: MiscConstResponseData;
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
  miscConst: miscConstProp,
}: UsePoolDetailArgs): UsePoolDetail => {
  const data = query.data?.data;
  const { data: basicData } = useFetchMiscBasic();
  const miscConstFallback = useMiscConst(basicData?.data.version.const);
  const miscConst = miscConstProp ?? miscConstFallback;
  const epochElapsed = useElapsedEpochNumber(miscConst);

  const [linkModal, setLinkModal] = useState<boolean>(false);

  const proratedLuck = data?.epochs[0].data.block && estimatedBlocks > 0
    ? (() => {
        const percent =
          ((data?.blocks?.epoch || 0) / estimatedBlocks / epochElapsed) * 100;

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

  const minDelegationAda = miscConst?.intra?.min_value
    ? (miscConst.intra.min_value / 1_000_000).toFixed(0)
    : "5";
  const extended = data?.pool_name?.extended;
  const socialIcons = buildSocialIcons(extended);

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
    {
      label: <DelegatorsLabel minDelegationAda={minDelegationAda} />,
      value: formatNumber(data?.delegators),
    },
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
              url={data?.pool_name.homepage ?? ""}
              onClose={() => setLinkModal(false)}
            />
          )}
        </>
      ),
    },
  ];

  if (socialIcons.length > 0) {
    aboutList.push({
      label: "",
      value: (
        <div className='mt-8 flex gap-2'>
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              title={social.alt}
            >
              <img src={social.icon} alt={social.alt} width={24} />
            </a>
          ))}
        </div>
      ),
    });
  }

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
      value: estimatedBlocks.toFixed(2),
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
