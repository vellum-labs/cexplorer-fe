import type { AssetListTableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import Tabs from "@/components/global/Tabs";
import GlobalTable from "@/components/table/GlobalTable";

import { useAssetListTableStore } from "@/stores/tables/assetListTableStore";
import { useSearch } from "@tanstack/react-router";

import { WatchlistFilter } from "@/components/global/watchlist/WatchlistFilter";
import {
  assetListTableOptions,
  assetListTableOptionsWithoutType,
} from "@/constants/tables/assetListTableOptions";
import { useAssetList } from "@/hooks/tables/useAssetList";
import type { AssetListType } from "@/types/assetsTypes";
import { PageBase } from "@/components/global/pages/PageBase";

interface AssetListPageProps {
  type?: AssetListType;
  policyId?: string;
  watchlist?: boolean;
  showHeader?: boolean;
}

export const AssetListPage: FC<AssetListPageProps> = ({
  type,
  policyId,
  watchlist,
  showHeader = true,
}) => {
  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useAssetListTableStore()(type === "all" ? undefined : type)();

  const { page } = useSearch({
    from: watchlist
      ? "/watchlist/"
      : policyId
        ? "/policy/$policyId"
        : type === "recent-tokens"
          ? "/asset/recent-tokens"
          : type === "recent-nfts"
            ? "/asset/recent-nfts"
            : "/asset/",
  });

  const {
    watchlistOnly,
    tableSearch,
    assetListQuery,
    columns,
    totalItems,
    items,
    setTabParam,
    setWatchlistOnly,
    setTableSearch,
  } = useAssetList({
    page,
    policyId,
    type,
    watchlist,
  });

  const tabs = [
    {
      key: "all",
      label: "All",
      visible: true,
    },
    {
      key: "token",
      label: "Tokens",
      visible: true,
    },
    {
      key: "nft",
      label: "NFTs",
      visible: true,
    },
  ];

  const tableOptions =
    type !== "all" ? assetListTableOptionsWithoutType : assetListTableOptions;

  return (
    <PageBase
      title={
        showHeader
          ? type === "all"
            ? "All Assets"
            : type === "nft"
              ? "NFTs"
              : type === "token"
                ? "Tokens"
                : type === "recent-tokens"
                  ? "Recent Tokens"
                  : "Recent NFTs"
          : undefined
      }
      showHeader={showHeader}
      breadcrumbItems={
        showHeader
          ? [
              {
                label:
                  type === "all"
                    ? "All Assets"
                    : type === "nft"
                      ? "NFTs"
                      : type === "token"
                        ? "Tokens"
                        : type === "recent-tokens"
                          ? "Recent Tokens"
                          : "Recent NFTs",
              },
            ]
          : undefined
      }
      metadataTitle='assetsList'
    >
      <section
        className={`flex w-full max-w-desktop flex-col ${!policyId && !watchlist ? "px-mobile pb-3 md:px-desktop" : ""}`}
      >
        <div className='mb-2 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
          <div className='flex w-full items-center justify-between gap-2'>
            {type === "all" && (
              <Tabs
                items={tabs}
                withMargin={false}
                withPadding={false}
                mobileItemsCount={3}
                onClick={activeTab =>
                  setTabParam(activeTab as "nft" | "token" | "all")
                }
              />
            )}
            <div className='flex items-center gap-2 md:hidden'>
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={tableOptions
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
                  })}
              />
            </div>
          </div>

          <div className='flex gap-2'>
            {!watchlist && (
              <WatchlistFilter
                watchlistOnly={watchlistOnly}
                setWatchlistOnly={setWatchlistOnly}
              />
            )}
            <TableSearchInput
              placeholder='Search by asset...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
            <div className='hidden items-center gap-2 md:flex'>
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={assetListTableOptions.map(item => {
                  return {
                    label: item.name,
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  };
                })}
              />
            </div>
          </div>
        </div>
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          rowHeight={60}
          minContentWidth={1100}
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
      </section>
    </PageBase>
  );
};
