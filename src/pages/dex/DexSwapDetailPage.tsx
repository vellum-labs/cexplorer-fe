import type { FC } from "react";
import { useMemo } from "react";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { ConsolidatedDexSwapDetailCard } from "@/components/dex/ConsolidatedDexSwapDetailCard";
import { SwapDetailTable } from "@/components/dex/SwapDetailTable";

import { useFetchMiscBasic } from "@/services/misc";
import { useFetchDeFiOrderList } from "@/services/token";
import { aggregateSwapData } from "@/utils/dex/aggregateSwapData";

import { getRouteApi } from "@tanstack/react-router";
import { formatString } from "@/utils/format/format";
import { PageBase } from "@/components/global/pages/PageBase";

export const DexSwapDetailPage: FC = () => {
  const route = getRouteApi("/dex/swap/$hash");
  const { hash } = route.useParams();

  const { data: swapData, isLoading } = useFetchDeFiOrderList(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    hash,
    undefined,
    undefined,
  );
  const { data: miscBasic } = useFetchMiscBasic();

  const swapDetail = swapData?.pages.flatMap(page => page.data?.data);

  // Aggregate swap data from multiple orders
  const aggregatedData = useMemo(() => {
    if (!swapDetail || swapDetail.length === 0) return undefined;
    return aggregateSwapData(swapDetail) || undefined;
  }, [swapDetail]);

  return (
    <PageBase
      metadataTitle='dexSwapDetail'
      metadataReplace={{
        before: "%tx%",
        after: hash,
      }}
      breadcrumbItems={[
        {
          label: (
            <span className='inline pt-1'>
              Stake detail{" "}
              {Array.isArray(swapDetail) && swapDetail[0]?.user?.account
                ? `(${formatString(swapDetail[0]?.user?.account, "long")})`
                : ""}
            </span>
          ),
          ...(Array.isArray(swapDetail) && swapDetail[0]?.user?.account
            ? {
                link: "/stake/$stakeAddr",
                params: {
                  stakeAddr: swapDetail[0]?.user?.account,
                },
              }
            : {}),
        },
        {
          label: <span>{formatString(hash ?? "", "long")}</span>,
          ident: hash,
        },
      ]}
      title='Swap detail'
      subTitle={
        <HeaderBannerSubtitle
          hashString={formatString(hash ?? "", "long")}
          hash={hash}
        />
      }
      adsCarousel={false}
    >
      <div className='flex w-full max-w-desktop flex-col gap-5 p-mobile lg:p-desktop'>
        {/* Consolidated Overview Card */}
        <ConsolidatedDexSwapDetailCard
          miscBasic={miscBasic}
          aggregatedData={aggregatedData}
          isLoading={isLoading}
        />

        {/* Swap Detail Table - only show if we have data and it's not loading */}
        {!isLoading && aggregatedData && (
          <SwapDetailTable aggregatedData={aggregatedData} />
        )}
      </div>
    </PageBase>
  );
};
