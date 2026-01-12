import type { useFetchAssetList } from "@/services/assets";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { generateImageUrl } from "@/utils/generateImageUrl";

import { alphabetWithNumbers } from "@/constants/alphabet";
import { Pagination } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface PolicyAssetGridProps {
  query: ReturnType<typeof useFetchAssetList>;
  currentPage: number;
  infiniteScrolling: boolean;
  itemsPerPage: number;
}

export const PolicyAssetGrid: FC<PolicyAssetGridProps> = ({
  query,
  currentPage,
  infiniteScrolling,
  itemsPerPage,
}) => {
  const { t } = useAppTranslation("common");
  const items = query.data?.pages.flatMap(item => item.data?.data);
  const totalItems = query.data?.pages[0].data.count as number;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <div className='grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-1.5'>
        {query.isLoading
          ? Array.from({ length: itemsPerPage }, () => "skeleton").map(
              (_, i) => (
                <div
                  key={i}
                  className='flex w-[240px] flex-col gap-1/2 rounded-m border border-border'
                >
                  <LoadingSkeleton width='100%' height='280px' />
                </div>
              ),
            )
          : !query.isError &&
            (items ?? []).map((item, i) => {
              const assetSupply = item.stat.asset.quantity;
              const isNft = assetSupply
                ? assetSupply > 1
                  ? "token"
                  : "nft"
                : "token";
              const fingerprint = getAssetFingerprint(item.name);
              const encodedNameArr = encodeAssetName(item.name).split("");
              const assetNameArr = item.name.split("");

              return (
                <Link
                  to='/asset/$fingerprint'
                  params={{ fingerprint }}
                  key={`${item.stat.asset.last_mint}_${i}`}
                  className='flex flex-col items-center gap-1/2 overflow-hidden break-words rounded-m border border-border bg-cardBg'
                >
                  <Image
                    fullWidth
                    height={219}
                    className='aspect-square h-full w-full'
                    src={generateImageUrl(
                      isNft ? fingerprint : item.name,
                      "md",
                      isNft ? "nft" : "token",
                    )}
                    fallbackletters={[...encodedNameArr, ...assetNameArr]
                      .filter(char =>
                        alphabetWithNumbers.includes(char.toLowerCase()),
                      )
                      .slice(0, 3)
                      .join("")}
                  />
                  <p className='self-start px-1 py-2 text-text-lg font-bold text-primary'>
                    {renderAssetName({ name: item.name })}
                  </p>
                </Link>
              );
            })}
      </div>
      {!infiniteScrolling &&
        totalItems > itemsPerPage &&
        (query as UseInfiniteQueryResult).fetchNextPage && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      {((!query.isLoading && query.isError) ||
        (!query.isLoading && !(items ?? []).length)) && (
        <div className='flex w-full justify-center'>{t("policy.resultNotFound")}</div>
      )}
    </>
  );
};
