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

  const adaVolume =
    isStatsAvailable && detailData?.stat?.asset?.stats
      ? lovelaceToAda(detailData.stat.asset.stats[0]?.ada_volume)
      : "-";

  const overview: OverviewList = [
    {
      label: "Name",
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
      label: "Encoded Name",
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
      label: "Asset name",
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
      label: "Supply",
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
    overview.splice(2, 0, {
      label: "Price",
      value: <PriceAdaSmallAmount price={detailData?.dex?.price} />,
    });
    overview.splice(3, 0, {
      label: "Unique wallets",
      value: uniqueWallets,
    });
    overview.splice(5, 0, {
      label: "Volume",
      value: adaVolume,
    });
    overview.push({
      label: undefined,
      value: (
        <div className='flex w-full'>
          {["1d", "7d", "1M", "3M"].map((item, i, arr) => (
            <div
              className={`h-[48px] w-[57px] border border-border ${i === 0 ? "rounded-s-m" : ""} ${i === arr.length - 1 ? "rounded-e-m" : ""} flex flex-col justify-center`}
              key={item + "_" + i}
            >
              <p className='text-center text-text-xs text-grayTextPrimary'>
                {item}
              </p>
              <p className='text-center text-text-sm font-semibold'>TBD</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  const blockchain: OverviewList = [
    {
      label: "Asset ID",
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
      label: "Policy ID",
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
          label: "First mint",
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
          label: "Last mint",
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
          label: "Minted",
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
      label: "Mint Count",
      value: formatNumber(detailData?.stat?.asset?.mintc),
    },
  ];

  const tokenRegistry: OverviewList = [
    {
      label: "Name",
      value: detailData?.registry?.name,
    },
    {
      label: "Ticker",
      value: detailData?.registry?.ticker,
    },
    {
      label: "Description",
      value: detailData?.registry?.description
        ? parse(detailData?.registry?.description)
        : "-",
    },
  ];

  return { detailData, blockchain, overview, tokenRegistry, encodedNameArr };
};
