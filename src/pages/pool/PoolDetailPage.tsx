import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import PoolDetailOverview from "@/components/pool/PoolDetailOverview";
import AboutTabItem from "@/components/pool/tabs/AboutTabItem";
import { AwardsTabItem } from "@/components/pool/tabs/AwardsTabItem";
import { EmbedTabItem } from "@/components/pool/tabs/EmbedTabItem";
import BlocksTabItem from "@/components/pool/tabs/BlocksTabItem";
import DelegatorsTabItem from "@/components/pool/tabs/DelegatorsTabItem";
import PerformanceTabItem from "@/components/pool/tabs/PerformanceTabItem";
import RewardsTabItem from "@/components/pool/tabs/RewardsTabItem";
import { activeSlotsCoeff, epochLength } from "@/constants/confVariables";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchPoolDetail } from "@/services/pools";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { getRouteApi } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { VoteListPage } from "../governance/VoteListPage";
import { CircleAlert } from "lucide-react";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { useDelegateAction } from "@/hooks/useDelegateAction";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const PoolDetailPage = () => {
  const { t } = useAppTranslation("pages");
  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();

  const {
    showWalletModal,
    setShowWalletModal,
    showDelegationModal,
    setShowDelegationModal,
  } = useDelegateAction({
    type: "pool",
    ident: id,
  });

  const query = useFetchPoolDetail(
    id.startsWith("pool1") ? id : undefined,
    id.startsWith("pool1") ? undefined : id,
  );
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const data = query.data?.data;

  const estimatedBlocks =
    ((epochLength *
      activeSlotsCoeff *
      (1 - (miscConst?.epoch_param?.decentralisation ?? 0))) /
      (miscConst?.epoch_stat.stake.active ?? 1)) *
    (data?.active_stake ?? 1);

  const currentEpoch = basicData?.data?.block?.epoch_no;
  const retiringEpoch = data?.pool_retire?.live?.retiring_epoch;
  const poolUpdateTxId = data?.pool_update?.live?.tx?.id;
  const poolRetireTxId = data?.pool_retire?.live?.tx_id;
  const isRetireValid =
    poolUpdateTxId !== undefined &&
    poolRetireTxId !== undefined &&
    poolRetireTxId !== null &&
    poolUpdateTxId <= poolRetireTxId;
  const isRetiring =
    retiringEpoch !== null && retiringEpoch !== undefined && isRetireValid;
  const isAlreadyRetired =
    isRetiring && currentEpoch !== undefined && retiringEpoch <= currentEpoch;
  const isPoolRetiredOrRetiring = isRetiring;

  const poolDetailTabItems = [
    {
      key: "performance",
      label: t("pools.detailPage.tabs.performance"),
      content: <PerformanceTabItem />,
      visible: true,
    },
    {
      key: "blocks",
      label: t("pools.detailPage.tabs.blocks"),
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
      label: t("pools.detailPage.tabs.rewards"),
      content: <RewardsTabItem query={query} />,
      visible: true,
    },
    {
      key: "delegators",
      label: t("pools.detailPage.tabs.delegators"),
      content: <DelegatorsTabItem />,
      visible: true,
    },
    {
      key: "about",
      label: t("pools.detailPage.tabs.about"),
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
      label: t("pools.detailPage.tabs.awards"),
      content: <AwardsTabItem id={id} />,
      visible: true,
    },
    {
      key: "gov",
      label: t("pools.detailPage.tabs.governance"),
      content: <VoteListPage poolId={id} />,
      visible: true,
    },
    {
      key: "embed",
      label: t("pools.detailPage.tabs.embed"),
      content: (
        <EmbedTabItem poolId={id} poolTicker={data?.pool_name?.ticker} />
      ),
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
        <span className='mt-1/2 flex w-full items-center gap-1'>
          {data?.pool_name.ticker && (
            <Image
              src={generateImageUrl(data?.pool_id || "", "ico", "pool")}
              type='pool'
              height={35}
              width={35}
              className='flex-shrink-0 rounded-max'
            />
          )}
          <span className='flex-1 break-all'>
            {data?.pool_name.ticker
              ? `[${data?.pool_name.ticker}] ${data.pool_name.name}`
              : t("pools.detailPage.poolDetail")}
          </span>
        </span>
      }
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>{t("pools.breadcrumb")}</span>,
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
            title={t("pools.detailPage.poolId")}
            className='!mt-0'
          />
        </div>
      }
      homepageAd
    >
      {isRetiring && (
        <div className='mx-mobile mb-3 flex max-w-desktop items-start gap-2 rounded-m border border-border p-2 lg:mx-desktop'>
          <CircleAlert
            className='mt-0.5 flex-shrink-0 text-red-500'
            size={18}
          />
          <span className='font-medium text-red-500'>
            {isAlreadyRetired
              ? t("pools.detailPage.retired", { epoch: retiringEpoch })
              : t("pools.detailPage.retiring", { epoch: retiringEpoch })}
          </span>
        </div>
      )}
      <PoolDetailOverview
        query={query}
        estimatedBlocks={estimatedBlocks}
        miscConst={miscConst}
        isPoolRetiredOrRetiring={isPoolRetiredOrRetiring}
        externalDelegationModalOpen={showDelegationModal}
        onExternalDelegationModalClose={() => setShowDelegationModal(false)}
      />
      <Tabs items={poolDetailTabItems} />
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </PageBase>
  );
};

export default PoolDetailPage;
