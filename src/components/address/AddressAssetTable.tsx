import type { useFetchAddressDetail } from "@/services/address";
import type { AddressAsset } from "@/types/addressTypes";
import type { FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useAddressDetailAssetTableStore } from "@/stores/tables/addressDetailAssetTableStore";
import type {
  AddressDetailAssetColumns,
  TableColumns,
} from "@/types/tableTypes";

import type { useFetchStakeDetail } from "@/services/stake";
import {
  formatNumber,
  formatNumberWithSuffix,
} from "@vellumlabs/cexplorer-sdk";

import AssetCell from "../asset/AssetCell";
import { configJSON } from "@/constants/conf";
import { PolicyCell } from "../policy/PolicyCell";
import { PriceAdaSmallAmount } from "@/components/global/PriceAdaSmallAmount";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { AlertCircle } from "lucide-react";

interface AddressAssetTableProps {
  assets: AddressAsset[];
  addressQuery: ReturnType<
    typeof useFetchAddressDetail | typeof useFetchStakeDetail
  >;
  detail?: "address" | "stake";
  activeAsset: string | undefined;
  lowBalances: boolean;
}

export const AddressAssetTable: FC<AddressAssetTableProps> = ({
  addressQuery,
  activeAsset,
  assets,
}) => {
  const { columnsVisibility, columnsOrder, setColumsOrder } =
    useAddressDetailAssetTableStore();

  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;
  const tokenColumnName =
    activeAsset === "nfts"
      ? "NFT"
      : activeAsset === "tokens"
        ? "Token"
        : "Asset";

  const columns: TableColumns<(typeof assets)[0]> = [
    {
      key: "token",
      render: item => <AssetCell asset={item} isNft={item?.quantity === 1} />,
      title: tokenColumnName,
      visible: columnsVisibility.token,
      widthPx: 100,
    },
    {
      key: "policy_id",
      render: item => (
        <PolicyCell
          policyId={
            String(item.name).includes(".")
              ? String(item.name).split(".")[1]
              : String(item.name).slice(0, 56) || ""
          }
          enableHover
        />
      ),
      title: "Policy ID",
      visible: columnsVisibility.policy_id,
      widthPx: 100,
    },
    {
      key: "holdings",
      render: item => {
        const decimals = item?.registry?.decimals ?? 0;
        const value = item?.quantity ?? 0;
        const adjusted = value / Math.pow(10, decimals);
        const formattedFull = formatNumber(adjusted.toFixed(2));
        const formattedShort = formatNumberWithSuffix(
          parseFloat(adjusted.toFixed(2)),
        );

        return (
          <div className='flex w-full justify-end'>
            <Tooltip content={formattedFull}>
              <span className='text-text-sm'>{formattedShort}</span>
            </Tooltip>
          </div>
        );
      },
      title: <p className='w-full text-right'>Holdings</p>,
      visible: columnsVisibility.holdings,
      widthPx: 100,
    },
    {
      key: "supply",
      render: item => {
        if (item?.quantity === 1) return <p className='text-right'></p>;
        if (!item?.market?.quantity || !item?.quantity)
          return <p className='text-right'>-</p>;

        return (
          <p className='text-right'>
            {formatNumberWithSuffix(
              (item.quantity / item.market.quantity) * 100,
              false,
              4,
            )}
          </p>
        );
      },
      title: <p className='w-full text-right'>% Supply</p>,
      visible: activeAsset !== "nfts" && columnsVisibility.supply,
      widthPx: 50,
    },
  ];

  if (
    (activeAsset === "nfts" && nftMarket) ||
    (activeAsset !== "nfts" && tokenMarket)
  ) {
    columns.push({
      key: "price",
      render: item => {
        const liquidity = item.market?.liquidity ?? null;
        const hasLowLiquidity =
          liquidity !== null && liquidity > 0 && liquidity < 10_000_000_00;

        return (
          <div className='flex w-full items-center justify-end gap-1'>
            <PriceAdaSmallAmount price={item.market?.price} />
            {hasLowLiquidity && (
              <Tooltip content='Low liquidity (< 1000 ADA)'>
                <AlertCircle size={14} className='text-yellow-500' />
              </Tooltip>
            )}
          </div>
        );
      },
      title: <p className='w-full text-right'>Price</p>,
      visible: columnsVisibility.price,
      widthPx: 50,
    });

    columns.push({
      key: "value",
      render: item => {
        const decimals = item?.registry?.decimals ?? 0;
        const quantity = item?.quantity ?? 0;
        const price = item?.market?.price ?? 0;

        if (!price) {
          return <p className='text-right'>-</p>;
        }

        const adjustedQuantity = quantity / Math.pow(10, decimals);
        const valueInLovelace = adjustedQuantity * price;

        return (
          <div className='flex w-full justify-end'>
            <AdaWithTooltip data={valueInLovelace} />
          </div>
        );
      },
      title: <p className='w-full text-right'>Value</p>,
      visible: columnsVisibility.value,
      widthPx: 50,
    });
  }

  return (
    <GlobalTable
      type='default'
      pagination={true}
      totalItems={assets.length}
      scrollable
      query={addressQuery}
      minContentWidth={tokenMarket || nftMarket ? 1000 : 500}
      items={assets}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof AddressDetailAssetColumns) -
          columnsOrder.indexOf(b.key as keyof AddressDetailAssetColumns)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
