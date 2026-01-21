import type { AssetDetail } from "@/types/assetsTypes";
import type { OverviewList } from "@vellumlabs/cexplorer-sdk";
import type { useFetchAssetDetail } from "@/services/assets";

import AssetCell from "@/components/asset/AssetCell";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";

import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

import parse from "html-react-parser";
import { PriceAdaSmallAmount } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface UseAssetDetailArgs {
  data: ReturnType<typeof useFetchAssetDetail>;
  type: "nft" | "token";
  formattedHex?: string;
}

interface UseAssetDetail {
  detailData: AssetDetail | undefined;
  overview: OverviewList;
  blockchain: OverviewList;
  tokenRegistry: OverviewList;
  encodedNameArr: string[];
}

export const useAssetDetail = ({
  data,
  type,
  formattedHex,
}: UseAssetDetailArgs): UseAssetDetail => {
  const { t } = useAppTranslation("common");
  const detailData = data?.data?.data;
  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;
  const assetName = (detailData?.policy || "") + detailData?.name;
  const encodedNameArr = encodeAssetName(assetName).split("") || [];
  const firstMint = detailData?.stat?.asset?.first_mint;
  const lastMint = detailData?.stat?.asset?.last_mint;

  const isStatsAvailable =
    Array.isArray(detailData?.stat?.asset?.stats) &&
    detailData?.stat?.asset?.stats.length > 0;

  const uniqueWallets =
    isStatsAvailable && detailData?.stat?.asset?.stats
      ? detailData.stat.asset.stats[0]?.holders
      : "-";

  const dailyVolume = (
    detailData?.dex?.stat as Record<string, { volume?: number }> | undefined
  )?.["1d"]?.volume;
  const adaVolume =
    dailyVolume !== undefined && dailyVolume !== null
      ? lovelaceToAda(dailyVolume)
      : "-";

  const overview: OverviewList = [
    {
      label: t("asset.name"),
      value: (
        <div className='max-w-[150px] sm:w-full'>
          <AssetCell
            asset={{
              name: `${detailData?.policy}${detailData?.name}`,
              quantity: detailData?.stat?.asset?.quantity ?? 0,
              registry: detailData?.registry,
            }}
            isNft={type === "nft"}
            hideImage
            formattedHex={formattedHex}
          />
        </div>
      ),
    },
    {
      label: t("asset.encodedName"),
      value: detailData?.name ? (
        <div className='flex items-center gap-1'>
          {detailData?.name?.length <= 8
            ? detailData?.name
            : formatString(String(detailData?.name), "long")}
          <Copy copyText={detailData?.name} />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: t("asset.assetName"),
      value: detailData?.policy ? (
        <div className='flex items-center gap-1'>
          {formatString((detailData?.policy || "") + detailData?.name, "long")}
          <Copy copyText={(detailData?.policy || "") + detailData?.name} />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: t("labels.supply"),
      value:
        detailData?.registry?.decimals && detailData?.stat?.asset?.quantity
          ? formatNumber(
              (
                detailData?.stat?.asset?.quantity /
                10 ** detailData?.registry?.decimals
              ).toFixed(2),
            )
          : detailData?.stat?.asset?.quantity
            ? formatNumber(detailData?.stat?.asset?.quantity)
            : "-",
    },
  ];

  if ((type === "nft" && nftMarket) || (type === "token" && tokenMarket)) {
    overview.push({
      label: t("asset.uniqueWallets"),
      value: uniqueWallets,
    });
    overview.push({
      label: t("asset.dailyVolume"),
      value: adaVolume,
    });
    overview.push({
      label: t("asset.price"),
      value: <PriceAdaSmallAmount price={detailData?.dex?.price} />,
    });
    const priceChangeData = [
      { label: "1d", key: "1d" },
      { label: "7d", key: "1w" },
      { label: "1M", key: "1m" },
      { label: "3M", key: "3m" },
    ];

    const getPriceChangePercent = (key: string) => {
      const stat = (
        detailData?.dex?.stat as Record<string, { change?: number }> | undefined
      )?.[key];
      if (!stat || stat.change === null || stat.change === undefined) return null;
      return ((stat.change - 1) * 100).toFixed(2);
    };

    overview.push({
      label: undefined,
      value: (
        <div className='flex w-full'>
          {priceChangeData.map((item, i, arr) => {
            const percent = getPriceChangePercent(item.key);
            const isPositive = percent !== null && parseFloat(percent) > 0;
            const isNegative = percent !== null && parseFloat(percent) < 0;

            return (
              <div
                className={`h-[48px] w-[70px] border border-border ${i === 0 ? "rounded-s-m" : ""} ${i === arr.length - 1 ? "rounded-e-m" : ""} flex flex-col justify-center`}
                key={item.label + "_" + i}
              >
                <p className='text-center text-text-xs text-grayTextPrimary'>
                  {item.label}
                </p>
                <p
                  className={`text-center text-text-sm font-semibold ${
                    isPositive
                      ? "text-greenText"
                      : isNegative
                        ? "text-redText"
                        : ""
                  }`}
                >
                  {percent !== null
                    ? `${isPositive ? "+" : ""}${percent}%`
                    : "-"}
                </p>
              </div>
            );
          })}
        </div>
      ),
    });
  }

  const blockchain: OverviewList = [
    {
      label: t("asset.assetId"),
      value: detailData?.fingerprint ? (
        <div className='flex items-center gap-1/2'>
          <span title={detailData?.fingerprint} className='text-text-sm'>
            {formatString(detailData?.fingerprint || "", "long")}
          </span>
          <Copy copyText={detailData?.fingerprint || ""} />
        </div>
      ) : (
        "-"
      ),
    },
    {
      label: t("asset.policyId"),
      value: detailData?.policy ? (
        <div className='flex items-center gap-1/2'>
          <Link
            to='/policy/$policyId'
            params={{ policyId: detailData?.policy ?? "" }}
            className='text-text-sm text-primary'
          >
            {formatString(detailData?.policy || "", "long")}
          </Link>
          <Copy copyText={detailData?.policy || ""} />
        </div>
      ) : (
        "-"
      ),
    },
    firstMint !== lastMint
      ? {
          label: t("asset.firstMint"),
          value: detailData?.stat?.asset?.first_mint ? (
            <TimeDateIndicator
              time={detailData?.stat?.asset?.first_mint ?? ""}
            />
          ) : (
            "-"
          ),
        }
      : undefined,
    firstMint !== lastMint
      ? {
          label: t("asset.lastMint"),
          value: detailData?.stat?.asset?.last_mint ? (
            <TimeDateIndicator
              time={detailData?.stat?.asset?.last_mint ?? ""}
            />
          ) : (
            "-"
          ),
        }
      : undefined,
    firstMint === lastMint
      ? {
          label: t("asset.minted"),
          value: detailData?.stat?.asset?.last_mint ? (
            <TimeDateIndicator
              time={detailData?.stat?.asset?.last_mint ?? ""}
            />
          ) : (
            "-"
          ),
        }
      : undefined,
    {
      label: t("asset.mintCount"),
      value: detailData?.stat?.asset?.mintc
        ? formatNumber(detailData?.stat?.asset?.mintc)
        : "-",
    },
  ];

  const tokenRegistry: OverviewList = [
    {
      label: t("asset.name"),
      value: detailData?.registry?.name,
    },
    {
      label: t("asset.ticker"),
      value: detailData?.registry?.ticker,
    },
    {
      label: t("asset.description"),
      value: detailData?.registry?.description
        ? parse(detailData?.registry?.description)
        : "-",
    },
  ];

  return { detailData, blockchain, overview, tokenRegistry, encodedNameArr };
};
