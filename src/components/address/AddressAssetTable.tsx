import type { useFetchAddressDetail } from "@/services/address";
import type { AddressAsset } from "@/types/addressTypes";
import type { FC } from "react";

import GlobalTable from "../table/GlobalTable";

import { useAddressDetailAssetTableStore } from "@/stores/tables/addressDetailAssetTableStore";
import type {
  AddressDetailAssetColumns,
  TableColumns,
} from "@/types/tableTypes";

import type { useFetchStakeDetail } from "@/services/stake";
import { formatNumber, formatNumberWithSuffix } from "@/utils/format/format";

import AssetCell from "../asset/AssetCell";
import { configJSON } from "@/constants/conf";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { PolicyCell } from "../policy/PolicyCell";

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

        return (
          <p className='text-right'>{formatNumber(adjusted.toFixed(2))}</p>
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
    {
      key: "ticker",
      render: item => {
        if (item?.quantity === 1) return <p className='text-right'></p>;
        const ticker = item?.registry?.ticker;
        return <p className='text-right'>{ticker || "-"}</p>;
      },
      title: <p className='w-full text-right'>Ticker</p>,
      visible: activeAsset !== "nfts" && columnsVisibility.ticker,
      widthPx: 40,
    },
  ];

  if (
    (activeAsset === "nfts" && nftMarket) ||
    (activeAsset !== "nfts" && tokenMarket)
  ) {
    columns.push({
      key: "price",
      render: item => {
        if (!item.market?.price) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className={`text-text-sm w-full text-right text-grayTextPrimary`}>
            {lovelaceToAda(item.market?.price)}
          </p>
        );
      },
      title: <p className='w-full text-right'>Price</p>,
      visible: columnsVisibility.price,
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
