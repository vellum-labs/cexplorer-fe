import type { FC } from "react";
import { HeaderBannerSubtitle } from "@/components/global/HeaderBannerSubtitle";
import { DexSwapDetailCard } from "@/components/dex/DexSwapDetailCard";

import { useFetchMiscBasic } from "@/services/misc";
import { useFetchDeFiOrderList } from "@/services/token";

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
            <span className='inline pt-1/2'>
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
      <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile lg:p-desktop'>
        {isLoading ? (
          <DexSwapDetailCard
            miscBasic={undefined}
            swapDetail={undefined}
            isLoading={true}
          />
        ) : (
          swapDetail?.map(item => (
            <DexSwapDetailCard
              miscBasic={miscBasic}
              swapDetail={item}
              isLoading={false}
            />
          ))
        )}
      </div>
    </PageBase>
  );
};
