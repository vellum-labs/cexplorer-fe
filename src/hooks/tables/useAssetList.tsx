import type { AssetList, AssetListType } from "@/types/assetsTypes";
import type { AssetListTableColumns, TableColumns } from "@/types/tableTypes";
import type { Dispatch, SetStateAction } from "react";

import { useFetchAssetList } from "@/services/assets";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useAssetListTableStore } from "@/stores/tables/assetListTableStore";
import { useEffect, useState } from "react";
import { useAuthToken } from "../useAuthToken";

import AssetCell from "@/components/asset/AssetCell";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { PolicyCell } from "@/components/policy/PolicyCell";
import { DateCell } from "@vellumlabs/cexplorer-sdk";

import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { useSearchTable } from "./useSearchTable";
import { useSearch } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation("pages");
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { columnsVisibility, setColumnVisibility, rows } =
    useAssetListTableStore(storeKey)(type === "all" ? undefined : type)();
  const { tab } = useSearch({ strict: false });

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

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
        : policyId
          ? undefined
          : tab === "all"
            ? undefined
            : tab,
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
            name={item.name as string}
            isNft={item?.stat?.asset?.quantity === 1}
          />
        );
      },
      title: t("assets.table.name"),
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
      title: t("assets.table.policy"),
      visible: columnsVisibility.policy_id && !policyId,
      widthPx: 150,
    },
    {
      key: "asset_minted",
      render: item => <DateCell time={item?.stat?.asset?.last_mint ?? ""} />,
      title: t("assets.table.mintTime"),
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
      title: <p className='w-full text-right'>{t("assets.table.price")}</p>,
      visible: columnsVisibility.price,
      widthPx: 50,
    },
  ];

  if (type === "all") {
    columns.splice(1, 0, {
      key: "type",
      render: item => {
        if (item?.stat?.asset?.quantity > 1) {
          return <Badge color='blue'>{t("assets.table.token")}</Badge>;
        }

        return <Badge color='yellow'>{t("assets.table.nft")}</Badge>;
      },
      title: t("assets.table.type"),
      visible: (columnsVisibility as AssetListTableColumns).type,
      widthPx: 50,
    });
  }

  if (type !== "nft") {
    columns.splice(3, 0, {
      key: "mint_quantity",
      render: item => {
        const quantity = item?.stat?.asset?.quantity;
        if (quantity === undefined || quantity === null) {
          return <p className='text-right'>-</p>;
        }

        const decimals = item?.registry?.decimals;
        const adjustedQuantity =
          decimals !== undefined && decimals !== null && decimals > 0
            ? quantity / 10 ** decimals
            : quantity;

        return (
          <p className='text-right'>
            {formatNumberWithSuffix(adjustedQuantity)}
          </p>
        );
      },
      title: <p className='w-full text-right'>{t("assets.table.supply")}</p>,
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
    setWatchlistOnly,
    setTableSearch,
  };
};
