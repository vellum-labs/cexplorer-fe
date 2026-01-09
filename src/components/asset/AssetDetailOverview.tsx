import type { useFetchAssetDetail } from "@/services/assets";
import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { WatchlistSection } from "../global/watchlist/WatchlistSection";

import { useAssetDetail } from "@/hooks/details/useAssetDetail";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AssetDetailOverviewProps {
  data: ReturnType<typeof useFetchAssetDetail>;
  type: "nft" | "token";
  formattedHex?: string;
  isLoading?: boolean;
  hasDex?: boolean;
  assetName?: string;
}

export const AssetDetailOverview: FC<AssetDetailOverviewProps> = ({
  data,
  type,
  isLoading,
  formattedHex,
  hasDex,
  assetName,
}) => {
  const { t } = useAppTranslation("common");
  const { detailData, blockchain, overview, tokenRegistry } = useAssetDetail({
    data,
    type,
    formattedHex,
  });

  return (
    <section className='flex w-full flex-col gap-1.5'>
      <WatchlistSection
        ident={detailData?.fingerprint}
        isLoading={!!isLoading}
        hasDex={hasDex}
        assetName={assetName}
      />
      <div className='flex flex-wrap gap-3'>
        <div className='flex-grow basis-[390px] md:flex-shrink-0'>
          <OverviewCard
            title={t("asset.overview")}
            overviewList={overview}
            endContent={
              detailData?.stat?.asset?.quantity === 0 ? (
                <span className='text-text-lg font-medium text-redText'>
                  {t("asset.assetBurned")}
                </span>
              ) : null
            }
            labelClassname='min-w-[135px] text-nowrap'
            className='md:h-full'
          />
        </div>
        <div className='flex-grow basis-[350px] md:flex-shrink-0'>
          <OverviewCard
            title={t("asset.blockchain")}
            overviewList={blockchain}
            labelClassname='text-nowrap min-w-[160px]'
            className='h-full'
          />
        </div>
        {detailData?.registry && (
          <div className='flex-grow basis-[328px] md:flex-shrink-0'>
            <OverviewCard
              title={t("asset.tokenRegistry")}
              overviewList={tokenRegistry}
              labelClassname='text-nowrap min-w-[160px]'
              className='h-full'
            />
          </div>
        )}
      </div>
    </section>
  );
};
