import type { AssetListTableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

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
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation("pages");
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
      label: t("assets.tabs.all"),
      visible: true,
    },
    {
      key: "token",
      label: t("assets.tabs.tokens"),
      visible: true,
    },
    {
      key: "nft",
      label: t("assets.tabs.nfts"),
      visible: true,
    },
  ];

  const tableOptions =
    type !== "all" ? assetListTableOptionsWithoutType : assetListTableOptions;

  const getPageTitle = () => {
    if (type === "all") return t("assets.all");
    if (type === "nft") return t("assets.nfts");
    if (type === "token") return t("assets.tokens");
    if (type === "recent-tokens") return t("assets.recentTokens");
    return t("assets.recentNfts");
  };

  return (
    <PageBase
      title={showHeader ? getPageTitle() : undefined}
      showHeader={showHeader}
      breadcrumbItems={
        showHeader
          ? [
              {
                label: getPageTitle(),
              },
            ]
          : undefined
      }
      metadataTitle='assetsList'
    >
      <section
        className={`flex w-full max-w-desktop flex-col ${!policyId && !watchlist ? "px-mobile pb-3 md:px-desktop" : ""}`}
      >
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full items-center justify-between gap-1'>
            {type === "all" && (
              <Tabs
                items={tabs}
                withMargin={false}
                withPadding={false}
                mobileItemsCount={3}
              />
            )}
            <div className='flex items-center gap-1 md:hidden'>
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

          <div className='flex gap-1'>
            {!watchlist && (
              <WatchlistFilter
                watchlistOnly={watchlistOnly}
                setWatchlistOnly={setWatchlistOnly}
              />
            )}
            <TableSearchInput
              placeholder={t("assets.searchPlaceholder")}
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
            <div className='hidden items-center gap-1 md:flex'>
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
