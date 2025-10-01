import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { Image } from "@/components/global/Image";
import Tabs from "@/components/global/Tabs";
import PoolDetailOverview from "@/components/pool/PoolDetailOverview";
import AboutTabItem from "@/components/pool/tabs/AboutTabItem";
import { AwardsTabItem } from "@/components/pool/tabs/AwardsTabItem";
import BlocksTabItem from "@/components/pool/tabs/BlocksTabItem";
import DelegatorsTabItem from "@/components/pool/tabs/DelegatorsTabItem";
import PerformanceTabItem from "@/components/pool/tabs/PerformanceTabItem";
import RewardsTabItem from "@/components/pool/tabs/RewardsTabItem";
import { activeSlotsCoeff, epochLength } from "@/constants/confVariables";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchPoolDetail } from "@/services/pools";
import { formatString } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { getRouteApi } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";

const PoolDetailPage = () => {
  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();
  const query = useFetchPoolDetail(
    id.startsWith("pool1") ? id : undefined,
    id.startsWith("pool1") ? undefined : id,
  );
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const data = query.data?.data;

  const estimatedBlocks =
    ((epochLength *
      activeSlotsCoeff *
      (1 - (miscConst?.epoch_param?.decentralisation ?? 0))) /
      (miscConst?.epoch_stat.stake.active ?? 1)) *
    (data?.active_stake ?? 1);

  const poolDetailTabItems = [
    {
      key: "performance",
      label: "Performance",
      content: <PerformanceTabItem />,
      visible: true,
    },
    {
      key: "blocks",
      label: "Blocks",
      content: (
        <BlocksTabItem
          blocksInEpoch={data?.blocks?.epoch ?? 0}
          estimatedBlocks={estimatedBlocks}
        />
      ),
      visible: true,
    },
    {
      key: "rewards",
      label: "Rewards",
      content: <RewardsTabItem query={query} />,
      visible: true,
    },
    {
      key: "delegators",
      label: "Delegators",
      content: <DelegatorsTabItem />,
      visible: true,
    },
    {
      key: "about",
      label: "About",
      content: data ? (
        <AboutTabItem
          id={id}
          description={data.pool_name?.description ?? ""}
          detailData={data}
        />
      ) : null,
      visible: true,
    },
    {
      key: "awards",
      label: "Awards",
      content: <AwardsTabItem id={id} />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='poolDetail'
      metadataReplace={{
        before: "%name%",
        after: data?.pool_name?.name ?? "",
      }}
      title={
        <span className='mt-1 flex w-full items-center gap-2'>
          {data?.pool_name.ticker && (
            <Image
              src={generateImageUrl(data?.pool_id || "", "ico", "pool")}
              type='pool'
              height={35}
              width={35}
              className='flex-shrink-0 rounded-full'
            />
          )}
          <span className='flex-1 break-all'>
            {data?.pool_name.ticker
              ? `[${data?.pool_name.ticker}] ${data.pool_name.name}`
              : "Pool detail"}
          </span>
        </span>
      }
      breadcrumbItems={[
        {
          label: <span className='inline pt-1'>Pools</span>,
          link: "/pool",
        },
        {
          label: (
            <span className=''>
              {formatString(id.split("1")[1] ?? "", "long")}
            </span>
          ),
          ident: id,
        },
      ]}
      subTitle={
        <div className='flex flex-col'>
          <HeaderBannerSubtitle
            hashString={formatString(data?.hash_raw ?? "", "long")}
            hash={data?.hash_raw}
            className='!mb-0'
          />
          <HeaderBannerSubtitle
            hashString={formatString(id ?? "", "long")}
            hash={id}
            title='Pool ID'
            className='!mt-0'
          />
        </div>
      }
    >
      <PoolDetailOverview query={query} estimatedBlocks={estimatedBlocks} />
      <Tabs items={poolDetailTabItems} />
    </PageBase>
  );
};

export default PoolDetailPage;
