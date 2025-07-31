import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { blocksListTableOptions } from "@/constants/tables/blocksListTableOptions";
import { useBlockListTableStore } from "@/stores/tables/blockListTableStore";
import type { BlockListColumns } from "@/types/tableTypes";
import { formatNumber } from "@/utils/format/format";
import { isHex } from "@/utils/isHex";
import { isTextNumeric } from "@/utils/isTextNumeric";
import { useSearch } from "@tanstack/react-router";
import { useBlockList } from "@/hooks/tables/useBlockList";
import { PageBase } from "@/components/global/pages/PageBase";

const BlocksListPage = () => {
  const { page } = useSearch({ from: "/block/" });

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
    setSearchPrefix,
    setTableSearch,
  } = useBlockList({
    page,
  });

  return (
    <PageBase
      metadataTitle='blockList'
      title='Blocks'
      breadcrumbItems={[{ label: "Blocks" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-5 md:px-desktop'>
        <div className='mb-4 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center'>
          <div className='flex w-full items-center justify-between gap-2'>
            {!totalItems ? (
              <LoadingSkeleton height='27px' width={"220px"} />
            ) : (
              <h3 className='basis-[230px]'>
                Total of {formatNumber(totalItems ?? 0)} blocks
              </h3>
            )}
            <div className='flex items-center gap-2 md:hidden'>
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

          <div className='flex gap-2'>
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
            <div className='hidden items-center gap-2 md:flex'>
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
