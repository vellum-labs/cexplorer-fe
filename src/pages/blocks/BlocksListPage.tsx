import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { blocksListTableOptions } from "@/constants/tables/blocksListTableOptions";
import { useBlockListTableStore } from "@/stores/tables/blockListTableStore";
import type { BlockListColumns } from "@/types/tableTypes";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { isHex } from "@/utils/isHex";
import { isTextNumeric } from "@/utils/isTextNumeric";
import { useSearch } from "@tanstack/react-router";
import { useBlockList } from "@/hooks/tables/useBlockList";
import { PageBase } from "@/components/global/pages/PageBase";
import { X } from "lucide-react";
import type { FilterKey } from "@/hooks/tables/useDrepList";
import SortBy from "@/components/ui/sortBy";

const BlocksListPage = () => {
  const { page, order, ...rest } = useSearch({ from: "/block/" });

  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useBlockListTableStore()();

  const {
    totalItems,
    columns,
    items,
    searchPrefix,
    tableSearch,
    blockListQuery,
    hasFilter,
    filter,
    selectItems,
    selectedItem,
    setSelectedItem,
    changeFilterByKey,
    setSearchPrefix,
    setTableSearch,
  } = useBlockList({
    page,
    order,
    restSearch: rest,
  });

  return (
    <PageBase
      metadataTitle='blockList'
      title='Blocks'
      breadcrumbItems={[{ label: "Blocks" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        {!totalItems ? (
          <p className='pb-1.5'>
            <LoadingSkeleton height='27px' width={"220px"} />
          </p>
        ) : (
          <h3 className='pb-1.5'>
            Total of {formatNumber(totalItems ?? 0)} blocks
          </h3>
        )}
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full justify-between'>
            <div className='flex items-center gap-1 pr-1.5'>
              <SortBy
                selectItems={selectItems}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
              />
            </div>
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={blocksListTableOptions.map(item => {
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
            <TableSearchInput
              placeholder='Search your results...'
              value={tableSearch}
              onchange={value => {
                if (
                  searchPrefix === "epoch_no" ||
                  searchPrefix === "slot_no" ||
                  searchPrefix === "block_no"
                ) {
                  const numericValue = value.replace(/\D/g, "");
                  setTableSearch(numericValue);
                } else {
                  setTableSearch(value);
                }
              }}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              prefixes={[
                {
                  key: "pool_id",
                  name: "Pool ID",
                  show:
                    tableSearch.startsWith("pool1") ||
                    "pool1".startsWith(tableSearch),
                },
                {
                  key: "epoch_no",
                  name: "Epoch",
                  show: isTextNumeric(tableSearch),
                },
                {
                  key: "hash",
                  name: "Hash",
                  show: tableSearch.length < 1 || isHex(tableSearch),
                },
                {
                  key: "slot_no",
                  name: "Slot",
                  show: isTextNumeric(tableSearch),
                },
                {
                  key: "block_no",
                  name: "Height",
                  show: isTextNumeric(tableSearch),
                },
              ]}
              searchPrefix={searchPrefix}
              setSearchPrefix={setSearchPrefix}
              inputClassName=''
            />
            <div className='hidden items-center gap-1 md:flex'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={blocksListTableOptions.map(item => {
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
        {hasFilter && (
          <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
            {Object.entries(filter).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                  >
                    <span>{key[0].toUpperCase() + key.slice(1)}:</span>
                    {key === "epoch_no" && (
                      <span>
                        {String(value)[0].toUpperCase() +
                          String(value).slice(1).toLowerCase()}
                      </span>
                    )}
                    {key === "pool_id" && (
                      <span>{formatString(String(value), "long")}</span>
                    )}
                    {key === "proto" && <span>{String(value)}</span>}
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
          query={blockListQuery}
          rowHeight={65}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof BlockListColumns) -
              columnsOrder.indexOf(b.key as keyof BlockListColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};

export default BlocksListPage;
