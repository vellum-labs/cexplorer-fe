import type { AssetList } from "@/types/assetsTypes";
import type { AssetListTableColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import AssetCell from "@/components/asset/AssetCell";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import { ViewSwitch } from "@/components/global/ViewSwitch";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";
import { PolicyAssetGrid } from "../PolicyAssetGrid";
import { PolicyCell } from "../PolicyCell";

import { useFetchAssetList } from "@/services/assets";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { usePolicyDetailAssetListTableStore } from "@/stores/tables/policyDetailAssetListTableStore";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { assetListTableOptionsWithoutType } from "@/constants/tables/assetListTableOptions";

import { useViewStore } from "@/stores/viewStore";
import { formatNumber } from "@/utils/format/format";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

interface PolicyDetailNftAssetProps {
  policyId: string;
}

export const PolicyDetailNftAsset: FC<PolicyDetailNftAssetProps> = ({
  policyId,
}) => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({
    from: "/policy/$policyId",
  });
  const { view } = useViewStore();

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [totalItems, setTotalItems] = useState(0);

  const {
    columnsVisibility,
    rows,
    setColumnVisibility,
    setRows,
    columnsOrder,
    setColumsOrder,
  } = usePolicyDetailAssetListTableStore();

  const assetListQuery = useFetchAssetList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    undefined,
    debouncedTableSearch.length > 0 ? debouncedTableSearch : undefined,
    undefined,
    policyId,
    undefined,
    undefined,
  );

  const totalAssets = assetListQuery.data?.pages[0].data.count;
  const items = assetListQuery.data?.pages.flatMap(page => page.data.data);

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
      widthPx: 110,
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
      widthPx: 100,
    },
    {
      key: "asset_minted",
      render: item => <DateCell time={item?.stat?.asset?.last_mint ?? ""} />,
      title: "Asset Minted",
      visible: columnsVisibility.asset_minted,
      widthPx: 45,
    },
    {
      key: "mint_quantity",
      render: item => (
        <p className='text-right'>
          {formatNumber(item?.stat?.asset?.quantity) ?? "-"}
        </p>
      ),
      title: <p className='w-full text-right'>Mint Quantity</p>,
      visible: (columnsVisibility as AssetListTableColumns).mint_quantity,
      widthPx: 45,
    },
    {
      key: "mint_count",
      render: item => (
        <p className='text-right'>
          {formatNumber(item?.stat?.asset?.mintc) ?? "-"}
        </p>
      ),
      title: <p className='w-full text-right'>Mint Count</p>,
      visible: columnsVisibility.mint_count,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    if (totalAssets !== undefined && totalAssets !== totalItems) {
      setTotalItems(totalAssets);
    }
  }, [totalAssets, totalItems]);

  return (
    <>
      <div>
        <div className='mb-2 flex justify-between'>
          <div className='hidden min-[500px]:block'>
            <ViewSwitch />
          </div>
          <div className='flex w-full gap-1 min-[500px]:w-fit'>
            <TableSearchInput
              placeholder='Search by asset...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='min-[500px]:w-[320px] w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
            {
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={
                  view !== "grid"
                    ? assetListTableOptionsWithoutType
                        .filter(item => columnsVisibility[item.key])
                        .map(item => {
                          return {
                            label: item.name,
                            isVisible: columnsVisibility[item.key],
                            onClick: () =>
                              setColumnVisibility(
                                item.key,
                                !columnsVisibility[item.key],
                              ),
                          };
                        })
                    : []
                }
              />
            }
          </div>
        </div>
        <div className='mb-2 block min-[500px]:hidden'>
          <ViewSwitch />
        </div>
      </div>
      {view === "grid" ? (
        <PolicyAssetGrid
          query={assetListQuery}
          currentPage={page ?? 1}
          infiniteScrolling={infiniteScrolling}
          itemsPerPage={rows}
        />
      ) : (
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          rowHeight={65}
          minContentWidth={800}
          itemsPerPage={rows}
          scrollable
          query={assetListQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof AssetListTableColumns) -
              columnsOrder.indexOf(b.key as keyof AssetListTableColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      )}
    </>
  );
};
