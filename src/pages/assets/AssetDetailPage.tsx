import { AssetDetailOverview } from "@/components/asset/AssetDetailOverview";
import { AssetMetaDataTab } from "@/components/asset/tabs/AssetMetaDataTab";
import { AssetMintTab } from "@/components/asset/tabs/AssetMintTab";
import { AssetNftOwnersTab } from "@/components/asset/tabs/AssetNftOwnersTab";
import { AssetTokenOwnersTab } from "@/components/asset/tabs/AssetTokenOwnersTab";
import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { useEffect, useState, type FC } from "react";
import metadata from "../../../conf/metadata/en-metadata.json";
import { TxListPage } from "../tx/TxListPage";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { useFetchAssetDetail } from "@/services/assets";

import { AssetStatsTab } from "@/components/asset/tabs/AssetStatsTab";
import { AssetTimelockTab } from "@/components/asset/tabs/AssetTimelockTab";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { ProBadge } from "@vellumlabs/cexplorer-sdk";
import { adaHandlePolicy, proPolicy } from "@/constants/confVariables";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import { AssetExchangesTab } from "@/components/asset/tabs/AssetExchangesTab";
import { PageBase } from "@/components/global/pages/PageBase";
import { configJSON } from "@/constants/conf";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { alphabetWithNumbers } from "@/constants/alphabet";

export const AssetDetailPage: FC = () => {
  const { t } = useAppTranslation("common");
  const [title, setTitle] = useState<string>("");
  const route = getRouteApi("/asset/$fingerprint");
  const { fingerprint } = route.useParams();

  const { page } = useSearch({
    from: "/asset/$fingerprint",
  });

  const assetDetailQuery = useFetchAssetDetail(fingerprint);
  const assetSupply = assetDetailQuery.data?.data?.stat?.asset?.quantity;

  const assetScript = assetDetailQuery.data?.data?.stat?.policy?.script;
  const timelock = !!assetScript && assetScript.type === "timelock";
  const assetStats = assetDetailQuery.data?.data?.stat?.asset?.stats;

  const policyId = configJSON.integration[0].adahandle[0].policy;

  const assetName =
    (assetDetailQuery?.data?.data?.policy || "") +
    assetDetailQuery?.data?.data?.name;

  const tabs = [
    {
      key: "Stats",
      label: t("asset.statsTab"),
      content: <AssetStatsTab fingerprint={fingerprint} />,
      visible:
        assetDetailQuery.isLoading ||
        !!(Array.isArray(assetStats) ? assetStats : [])?.some(
          stat => stat.count,
        ),
    },
    {
      key: "transactions",
      label: t("asset.transactionsTab"),
      content: <TxListPage asset={fingerprint} />,
      visible: true,
    },
    {
      key: "mints",
      label: t("asset.mintsTab"),
      content: (
        <AssetMintTab
          name={(assetDetailQuery.data?.data?.name ?? 0) as number}
          policy={assetDetailQuery.data?.data?.policy ?? ""}
        />
      ),
      visible: true,
    },
    {
      key: "timelock",
      label: t("asset.timelockTab"),
      content: (
        <>
          <AssetTimelockTab json={assetScript?.json} />
        </>
      ),
      visible: timelock,
    },
    {
      key: "metadata",
      label: t("asset.metadataTab"),
      content: (
        <AssetMetaDataTab
          name={assetDetailQuery.data?.data?.name}
          policy={assetDetailQuery.data?.data?.policy}
        />
      ),
      visible: true,
    },
    {
      key: "owners",
      label: t("asset.ownersTab"),
      content: assetSupply ? (
        assetSupply > 1 ? (
          <AssetTokenOwnersTab
            name={(assetDetailQuery.data?.data?.name ?? 0) as number}
            policy={assetDetailQuery.data?.data?.policy ?? ""}
            supply={assetSupply}
            price={assetDetailQuery?.data?.data?.dex?.price}
            decimals={assetDetailQuery?.data?.data?.registry?.decimals}
          />
        ) : (
          <AssetNftOwnersTab
            name={(assetDetailQuery.data?.data?.name ?? 0) as number}
            policy={assetDetailQuery.data?.data?.policy ?? ""}
            price={assetDetailQuery?.data?.data?.dex?.price}
          />
        )
      ) : undefined,
      visible: true,
    },
    {
      key: "trading",
      label: t("asset.tradingTab"),
      content: () => (
        <DeFiOrderList
          storeKey='asset_detail_defi'
          assetName={assetName}
          page={page ?? 1}
          tabName='trading'
        />
      ),
      visible: !!assetDetailQuery?.data?.data?.dex,
    },
    {
      key: "exchanges",
      label: t("asset.priceTab"),
      content: (
        <AssetExchangesTab assetname={assetName} query={assetDetailQuery} />
      ),
      visible: !!assetDetailQuery?.data?.data?.dex,
    },
  ];

  useEffect(() => {
    if (assetDetailQuery?.data?.data?.name === undefined) return;

    setTitle(encodeAssetName(assetDetailQuery?.data?.data?.name || ""));
  }, [assetDetailQuery?.data?.data?.name]);

  const rawFormattedHex = assetDetailQuery.data?.data?.name
    ? assetDetailQuery.data?.data?.name.replace(
        /^(000de140|0014df10|000643b0|000010)/,
        "",
      )
    : undefined;

  const decodedHex = rawFormattedHex
    ? encodeAssetName(rawFormattedHex)
    : undefined;

  const isSafeToDisplay = (name: string): boolean => {
    return /^[\x20-\x7E]+$/.test(name);
  };

  const formattedHex =
    decodedHex && isSafeToDisplay(decodedHex) ? decodedHex : undefined;

  const nameByRegistry =
    assetDetailQuery?.data?.data?.registry?.name &&
    assetDetailQuery?.data?.data?.registry?.ticker
      ? `[${assetDetailQuery?.data?.data?.registry?.ticker}] ${assetDetailQuery?.data?.data?.registry?.name}`
      : undefined;

  const encodedNameArr = assetDetailQuery.data?.data?.name
    ? encodeAssetName(assetDetailQuery.data.data.name) || ""
    : "";

  return (
    <PageBase
      title={
        <span className='mt-1/2 flex w-full items-center gap-1'>
          <div className='group relative flex items-center'>
            <Image
              src={generateImageUrl(
                assetSupply && assetSupply === 1
                  ? fingerprint
                  : (assetDetailQuery.data?.data?.policy || "") +
                      assetDetailQuery.data?.data?.name,
                "md",
                assetSupply && assetSupply === 1 ? "nft" : "token",
              )}
              type='asset'
              className='aspect-square flex-shrink-0 rounded-max'
              fallbackletters={[...encodedNameArr]
                .filter(char =>
                  alphabetWithNumbers.includes(char.toLowerCase()),
                )
                .join("")}
              height={35}
              width={35}
            />
            <div className='pointer-events-none absolute left-0 top-full z-50 mt-2 hidden opacity-0 transition-opacity duration-200 group-hover:block group-hover:opacity-100'>
              <div className='flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-m bg-cardBg shadow-2xl ring-1 ring-border'>
                <img
                  src={generateImageUrl(
                    assetSupply && assetSupply === 1
                      ? fingerprint
                      : (assetDetailQuery.data?.data?.policy || "") +
                          assetDetailQuery.data?.data?.name,
                    "lg",
                    assetSupply && assetSupply === 1 ? "nft" : "token",
                  )}
                  alt='Asset preview'
                  className='h-auto max-h-[300px] w-auto max-w-[300px] object-contain'
                />
              </div>
            </div>
          </div>
          <span className='flex-1 break-all'>
            {nameByRegistry
              ? nameByRegistry
              : formattedHex && formattedHex.trim().length > 0
                ? formattedHex
                : formatString(fingerprint, "longer")}
          </span>
        </span>
      }
      breadcrumbItems={[
        {
          label: "Policy",
          link: `/policy/${assetDetailQuery.data?.data?.policy ?? ""}` as FileRoutesByPath[keyof FileRoutesByPath]["path"],
        },
        { label: formatString(fingerprint, "long"), ident: fingerprint },
      ]}
      subTitle={
        <HeaderBannerSubtitle
          hash={fingerprint}
          hashString={formatString(fingerprint, "long")}
          title='Asset ID'
        />
      }
      badge={
        <div className='flex items-center gap-1'>
          {assetDetailQuery.data?.data?.policy === adaHandlePolicy && (
            <AdaHandleBadge variant='long' policyId={policyId} />
          )}
          {assetDetailQuery.data?.data?.policy === proPolicy && <ProBadge />}
        </div>
      }
      metadataOverride={{
        title: metadata.assetDetail.title.replace(
          "%encodedname%",
          nameByRegistry || title,
        ),
      }}
      homepageAd
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
            {assetDetailQuery.isLoading ? (
              <>
                <LoadingSkeleton
                  height='328px'
                  rounded='xl'
                  className='grow basis-[410px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='328px'
                  rounded='xl'
                  className='grow basis-[410px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='328px'
                  rounded='xl'
                  className='grow basis-[410px] px-4 py-2'
                />
              </>
            ) : (
              <AssetDetailOverview
                data={assetDetailQuery}
                type={
                  assetSupply ? (assetSupply > 1 ? "token" : "nft") : "token"
                }
                isLoading={assetDetailQuery.isLoading}
                formattedHex={
                  formattedHex && formattedHex.trim().length > 0
                    ? formattedHex
                    : undefined
                }
                hasDex={!!assetDetailQuery?.data?.data?.dex}
                assetName={assetName}
              />
            )}
          </div>
        </div>
      </section>
      <Tabs items={tabs} apiLoading={assetDetailQuery.isLoading} />
    </PageBase>
  );
};
