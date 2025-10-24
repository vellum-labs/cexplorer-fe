import { useSearch } from "@tanstack/react-router";
import { usePoolList } from "@/hooks/tables/usePoolList";
import { usePoolsListTableStore } from "@/stores/tables/poolsListTableStore";
import { useFetchTopMarginsWithDelegators } from "@/services/pools";
import GlobalTable from "@/components/table/GlobalTable";
import { poolsListTableOptions } from "@/constants/tables/poolsListTableOptions";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { WatchlistFilter } from "@/components/global/watchlist/WatchlistFilter";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { PlusIcon, X } from "lucide-react";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { DisplayVoteModal } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import type { PoolsListColumns } from "@/types/tableTypes";
import { useFetchMiscSearch } from "@/services/misc";

const PoolListTab = ({ watchlist }: { watchlist?: boolean }) => {
  const { page, sort, order } = useSearch({
    from: watchlist ? "/watchlist/" : "/pool/",
  });

  const {
    selectItems,
    tableSearch,
    totalItems,
    watchlistOnly,
    tableRef,
    selectedItem,
    columns,
    poolsListQuery,
    items,
    displayVoteModal,
    hasFilter,
    filter,
    setDisplayVoteModal,
    setSelectedItem,
    setTableSearch,
    setWatchlistOnly,
    handleAddVoteFilter,
    changeFilterByKey,
  } = usePoolList({ page, sort, order, watchlist });

  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolsListTableStore()();

  const topMarginsQuery = useFetchTopMarginsWithDelegators(
    "top_margins_with_delegators",
    rows,
    (page ?? 1) * rows - rows,
    order === "delegators",
  );

  const data = topMarginsQuery?.data?.pages.flatMap(page => page.data.data);

  return (
    <section className={`flex w-full max-w-desktop flex-col gap-2`}>
      <div className='mb-1 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
        <div className='flex w-full flex-col gap-1'>
          {!watchlist && (
            <div>
              {totalItems === undefined ? (
                <LoadingSkeleton height='27px' width={"220px"} />
              ) : (
                <h3 className='basis-[230px]'>
                  Total of {formatNumber(totalItems)} stake pools
                </h3>
              )}
            </div>
          )}
          <div className='flex w-full flex-wrap items-center justify-between gap-1 min-[790px]:flex-nowrap'>
            <div className='flex items-center gap-1'>
              <SortBy
                selectItems={selectItems}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
              />
            </div>
            <div className='flex items-center gap-1 min-[790px]:flex-grow-0'>
              {!watchlist && (
                <WatchlistFilter
                  watchlistOnly={watchlistOnly}
                  setWatchlistOnly={setWatchlistOnly}
                />
              )}
              <TableSearchInput
                placeholder='Search your results...'
                value={tableSearch}
                onchange={setTableSearch}
                wrapperClassName='min-[790px]:w-[320px] hidden min-[790px]:flex w-full'
                showSearchIcon
                showPrefixPopup={false}
              />
              <Button
                size='md'
                leftIcon={<PlusIcon size={15} />}
                label='Display vote'
                variant='tertiary'
                onClick={() => setDisplayVoteModal(true)}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={poolsListTableOptions.map(item => ({
                  label: item.name,
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                }))}
              />
            </div>
            <TableSearchInput
              placeholder='Search your results...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='min-[790px]:w-[320px] flex min-[790px]:hidden w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
          </div>
        </div>
      </div>
      {hasFilter && (
        <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              typeof value !== "undefined" && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  <span>
                    {key === "gov_action" ? "Selected votes:" : "Is Drep"}:
                  </span>
                  <span>
                    {key === "gov_action"
                      ? formatString(value, "long")
                      : +value === 1
                        ? "Yes"
                        : "No"}
                  </span>
                  <X
                    size={13}
                    className='cursor-pointer'
                    onClick={() => changeFilterByKey(key)}
                  />
                </div>
              ),
          )}
        </div>
      )}
      <div ref={tableRef}>
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          itemsPerPage={rows}
          scrollable
          query={
            selectedItem === "Top Margins with Delegators"
              ? topMarginsQuery
              : poolsListQuery
          }
          minContentWidth={1200}
          items={
            (selectedItem === selectItems[1].key
              ? items?.slice().sort((a, b) => {
                  const pledgeA = a.pool_update.live.pledge;
                  const pledgeB = b.pool_update.live.pledge;

                  let pledgeALeverage = 0;
                  let pledgeBLeverage = 0;

                  if (
                    pledgeA > 0 &&
                    a.live_stake &&
                    a.pool_update.live.pledge
                  ) {
                    pledgeALeverage = Math.round(
                      a.live_stake / a.pool_update.live.pledge,
                    );
                  }

                  if (
                    pledgeB > 0 &&
                    b.live_stake &&
                    b.pool_update.live.pledge
                  ) {
                    pledgeBLeverage = Math.round(
                      b.live_stake / b.pool_update.live.pledge,
                    );
                  }

                  return pledgeBLeverage - pledgeALeverage;
                })
              : selectedItem === "Top Margins with Delegators"
                ? Array.isArray(data)
                  ? data
                  : []
                : items) as any
          }
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof PoolsListColumns) -
              columnsOrder.indexOf(b.key as keyof PoolsListColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
      {displayVoteModal && (
        <DisplayVoteModal
          onClose={() => setDisplayVoteModal(false)}
          onDisplay={handleAddVoteFilter}
          useFetchMiscSearch={useFetchMiscSearch}
        />
      )}
    </section>
  );
};

export default PoolListTab;
