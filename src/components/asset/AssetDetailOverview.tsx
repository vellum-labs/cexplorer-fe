import type { useFetchAssetDetail } from "@/services/assets";
import type { FC } from "react";

import { OverviewCard } from "../global/cards/OverviewCard";
import { Image } from "../global/Image";
import { WatchlistSection } from "../global/watchlist/WatchlistSection";

import { alphabetWithNumbers } from "@/constants/alphabet";
import { generateImageUrl } from "@/utils/generateImageUrl";

import { useAssetDetail } from "@/hooks/details/useAssetDetail";

interface AssetDetailOverviewProps {
  data: ReturnType<typeof useFetchAssetDetail>;
  type: "nft" | "token";
  formattedHex?: string;
  isLoading?: boolean;
}

export const AssetDetailOverview: FC<AssetDetailOverviewProps> = ({
  data,
  type,
  isLoading,
  formattedHex,
}) => {
  const { detailData, blockchain, overview, tokenRegistry, encodedNameArr } =
    useAssetDetail({ data, type, formattedHex });

  return (
    <section className='flex w-full flex-col gap-1.5'>
      <WatchlistSection
        ident={detailData?.fingerprint}
        isLoading={!!isLoading}
      />
      <div className='flex flex-wrap gap-3'>
        <div className='flex-grow basis-[390px] md:flex-shrink-0'>
          <OverviewCard
            title='Overview'
            overviewList={overview}
            endContent={
              detailData?.stat.asset.quantity === 0 ? (
                <span className='text-text-lg font-medium text-redText'>
                  This asset has been burned
                </span>
              ) : null
            }
            startContent={
              <Image
                src={generateImageUrl(
                  type === "nft"
                    ? detailData?.fingerprint || ""
                    : (detailData?.policy || "") + detailData?.name,
                  "md",
                  type === "nft" ? "nft" : "token",
                )}
                className='aspect-square rounded-m'
                fallbackletters={[...encodedNameArr]
                  .filter(char =>
                    alphabetWithNumbers.includes(char.toLowerCase()),
                  )
                  .join("")}
                height={48}
                width={48}
              />
            }
            labelClassname='min-w-[135px] text-nowrap'
            className='md:h-full'
          />
        </div>
        <div className='flex-grow basis-[350px] md:flex-shrink-0'>
          <OverviewCard
            title='Blockchain'
            overviewList={blockchain}
            labelClassname='text-nowrap min-w-[160px]'
            className='h-full'
          />
        </div>
        {detailData?.registry && (
          <div className='flex-grow basis-[328px] md:flex-shrink-0'>
            <OverviewCard
              title='Token Registry'
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
