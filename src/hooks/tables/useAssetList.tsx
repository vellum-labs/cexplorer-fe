import type { AssetList, AssetListType } from "@/types/assetsTypes";
import type { AssetListTableColumns, TableColumns } from "@/types/tableTypes";
import type { Dispatch, SetStateAction } from "react";

import { useFetchAssetList } from "@/services/assets";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useAssetListTableStore } from "@/stores/tables/assetListTableStore";
import { useEffect, useState } from "react";
import { useAuthToken } from "../useAuthToken";

import AssetCell from "@/components/asset/AssetCell";
import { Badge } from "@/components/global/badges/Badge";
import { PolicyCell } from "@/components/policy/PolicyCell";
import DateCell from "@/components/table/DateCell";

import { formatNumber } from "@/utils/format/format";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { useSearchTable } from "./useSearchTable";

interface UseAssetListArgs {
  page?: number;
  type?: AssetListType;
  policyId?: string;
  watchlist?: boolean;
  storeKey?: string;
  overrideRows?: number;
  overrideTableSearch?: string;
}

interface UseAssetList {
  watchlistOnly: boolean;
  tableSearch: string;
  totalItems: number;
  assetListQuery: ReturnType<typeof useFetchAssetList>;
  items?: any[];
  columns: TableColumns<AssetList>;
  columnsVisibility:
    | AssetListTableColumns
    | Omit<AssetListTableColumns, "type">
    | Omit<AssetListTableColumns, "type" | "mint_quantity">;
  setWatchlistOnly: Dispatch<SetStateAction<boolean>>;
  setTabParam: Dispatch<SetStateAction<"nft" | "token" | "all">>;
  setTableSearch: Dispatch<SetStateAction<string>>;
  setColumnVisibility: (storeKey: string, isVisible: boolean) => void;
}

export const useAssetList = ({
  page,
  policyId,
  type,
  watchlist,
  storeKey,
  overrideRows,
  overrideTableSearch,
}: UseAssetListArgs): UseAssetList => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { columnsVisibility, setColumnVisibility, rows } =
    useAssetListTableStore(storeKey)(type === "all" ? undefined : type)();

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();
  const [tabParam, setTabParam] = useState<"nft" | "token" | "all">("all");
  const [watchlistOnly, setWatchlistOnly] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const token = useAuthToken();

  const assetListQuery = useFetchAssetList(
    overrideRows ?? rows,
    infiniteScrolling
      ? 0
      : overrideRows
        ? (page ?? 1) * overrideRows - overrideRows
        : (page ?? 1) * rows - rows,
    type === "recent-tokens"
      ? "token"
      : type === "recent-nfts"
        ? "nft"
        : tabParam === "all"
          ? undefined
          : tabParam,
    overrideTableSearch
      ? overrideTableSearch
      : debouncedTableSearch.length > 0
        ? debouncedTableSearch
        : undefined,
    type === "recent-nfts" || type === "recent-tokens" ? "mint" : undefined,
    policyId,
    undefined,
    watchlistOnly || watchlist ? "1" : undefined,
    watchlistOnly || watchlist ? token : undefined,
  );

  const totalAssets = assetListQuery.data?.pages[0].data.count;
  const items = assetListQuery.data?.pages.flatMap(page => page.data.data);

  useEffect(() => {
    if (totalAssets !== undefined && totalAssets !== totalItems) {
      setTotalItems(totalAssets);
    }
  }, [totalAssets, totalItems]);

  const columns: TableColumns<AssetList> = [
    {
      key: "order",
      render: () => <></>,
      standByRanking: true,
      title: "#",
      visible: columnsVisibility.order,
      widthPx: 15,
    },
    {
      key: "asset",
      render: item => {
        return (
          <AssetCell
            key={item.name}
            asset={{
              name: String(item.name),
              registry: item.registry,
              quantity: item.stat.asset.quantity,
            }}
            isNft={item?.stat?.asset?.quantity === 1}
          />
        );
      },
      title: "Asset",
      visible: columnsVisibility.asset,
      widthPx: 150,
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
      visible: columnsVisibility.policy_id && !policyId,
      widthPx: 150,
    },
    {
      key: "asset_minted",
      render: item => <DateCell time={item?.stat?.asset?.last_mint ?? ""} />,
      title: "Asset minted",
      visible: columnsVisibility.asset_minted,
      widthPx: 60,
    },
    {
      key: "price",
      render: item => {
        if (!item?.dex?.price) {
          return <p className='w-full text-right'>-</p>;
        }

        return (
          <p className='w-full text-right'>
            <AdaWithTooltip data={item?.dex?.price} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Price</p>,
      visible: columnsVisibility.price,
      widthPx: 50,
    },
  ];

  if (type === "all") {
    columns.splice(1, 0, {
      key: "type",
      render: item => {
        if (item?.stat?.asset?.quantity > 1) {
          return <Badge color='blue'>Token</Badge>;
        }

        return <Badge color='yellow'>NFT</Badge>;
      },
      title: "Type",
      visible: (columnsVisibility as AssetListTableColumns).type,
      widthPx: 50,
    });
  }

  if (type !== "nft") {
    columns.splice(3, 0, {
      key: "mint_quantity",
      render: item => {
        if (!item?.registry?.decimals) {
          return (
            <p className='text-right'>
              {formatNumber(item?.stat?.asset?.quantity.toFixed(2)) ?? "-"}
            </p>
          );
        }

        return (
          <p className='text-right'>
            {formatNumber(
              (
                item?.stat.asset.quantity /
                10 ** item?.registry?.decimals
              ).toFixed(2),
            )}
          </p>
        );
      },
      title: <p className='w-full text-right'>Supply</p>,
      visible: (columnsVisibility as AssetListTableColumns).mint_quantity,
      widthPx: 120,
    });
  }

  return {
    watchlistOnly,
    tableSearch,
    assetListQuery,
    columns,
    items,
    totalItems,
    columnsVisibility,
    setColumnVisibility,
    setTabParam,
    setWatchlistOnly,
    setTableSearch,
  };
};
