import type { FilterKey } from "@/hooks/tables/useDrepList";
import type { DrepListTableColumns } from "@/types/tableTypes";

import { PlusIcon, X } from "lucide-react";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { DisplayVoteModal } from "@/components/global/modals/DisplayVoteModal";

import { drepListTableOptions } from "@/constants/tables/drepListTableOptions";

import { WatchlistFilter } from "@/components/global/watchlist/WatchlistFilter";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";

import { useDrepList } from "@/hooks/tables/useDrepList";
import { useDrepListTableStore } from "@/stores/tables/drepListTableStore";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@vellumlabs/cexplorer-sdk";

export const DrepListTab = ({ watchlist }: { watchlist?: boolean }) => {
  const { page, sort, order } = useSearch({
    from: watchlist ? "/watchlist/" : "/drep/",
  });

  const {
    columns,
    drepListQuery,
    items,
    totalItems,
    tableSearch,
    watchlistOnly,
    displayVoteModal,
    hasFilter,
    filter,
    setDisplayVoteModal,
    setTableSearch,
    setWatchlistOnly,
    handleAddVoteFilter,
    changeFilterByKey,
  } = useDrepList({
    watchlist,
    page,
    order,
    sort,
  });

  const {
    columnsVisibility,
    rows,
    setRows,
    setColumnVisibility,
    columnsOrder,
    setColumsOrder,
  } = useDrepListTableStore()();

  return (
    <>
      <div className='mb-1 flex w-full flex-col justify-between gap-1 min-[870px]:flex-row min-[870px]:items-center'>
        <div className='flex flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {!watchlist && (
            <>
              {drepListQuery.isLoading || drepListQuery.isFetching ? (
                <LoadingSkeleton height='27px' width={"220px"} />
              ) : totalItems !== undefined ? (
                <h3 className='basis-[230px] text-nowrap'>
                  Total of {formatNumber(totalItems)} dreps
                </h3>
              ) : (
                ""
              )}
            </>
          )}
          <div className='flex w-full justify-end min-[870px]:hidden'>
            <div className='flex items-center gap-1 min-[870px]:hidden'>
              <ExportButton columns={columns} items={items} />
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
                columnsOptions={drepListTableOptions.map(item => {
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

        <div className='flex gap-1'>
          {!watchlist && (
            <WatchlistFilter
              watchlistOnly={watchlistOnly}
              setWatchlistOnly={setWatchlistOnly}
            />
          )}
          <TableSearchInput
            placeholder='Search by Drep ID...'
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='min-[870px]:w-[320px] w-full '
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 min-[870px]:flex'>
            <ExportButton columns={columns} items={items} />
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
              columnsOptions={drepListTableOptions.map(item => {
                return {
                  label: item.name,
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
      </div>
      {hasFilter && (
        <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  <span>
                    {key === "gov_action"
                      ? "Selected votes:"
                      : `Also ${key[0].toUpperCase() + key.slice(1)}:`}
                  </span>

                  <span>
                    {key === "gov_action"
                      ? formatString(value, "long")
                      : value[0].toUpperCase() + value.slice(1).toLowerCase()}
                  </span>

                  <X
                    size={13}
                    className='cursor-pointer'
                    onClick={() => {
                      changeFilterByKey(key as FilterKey);
                    }}
                  />
                </div>
              ),
          )}
        </div>
      )}
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={drepListQuery}
        minContentWidth={1300}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof DrepListTableColumns) -
            columnsOrder.indexOf(b.key as keyof DrepListTableColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
      {displayVoteModal && (
        <DisplayVoteModal
          onClose={() => setDisplayVoteModal(false)}
          onDisplay={handleAddVoteFilter}
        />
      )}
    </>
  );
};
