import type { EpochBlockListColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { SizeCell } from "@vellumlabs/cexplorer-sdk";
import { useEpochBlockListTableStore } from "@/stores/tables/epochBlockListTableStore";
import { useSearch } from "@tanstack/react-router";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";

import { epochBlockTableOptions } from "@/constants/tables/epochBlockTableOptions";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { isTextNumeric } from "@/utils/isTextNumeric";

import { useEffect, useState } from "react";
import { useFetchBlocksList } from "@/services/blocks";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

interface EpochBlocksProps {
  no: number;
}

export const EpochBlocks: FC<EpochBlocksProps> = ({ no }) => {
  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useEpochBlockListTableStore();

  const { page } = useSearch({ from: "/epoch/$no" });
  const { infiniteScrolling } = useInfiniteScrollingStore();

  const [
    { debouncedTableSearch, tableSearch, searchPrefix },
    setTableSearch,
    setSearchPrefix,
  ] = useSearchTable({
    debounceFilter: tableSearch =>
      tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    validPrefixes: ["slot_no", "block_no"],
  });

  const blockListQuery = useFetchBlocksList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    !debouncedTableSearch.includes(":"),
    undefined,
    no,
    undefined,
    searchPrefix === "slot_no" ? parseInt(debouncedTableSearch) : undefined,
    searchPrefix === "block_no" ? parseInt(debouncedTableSearch) : undefined,
  );

  const [totalItems, setTotalItems] = useState(0);

  const totalBlocks = blockListQuery.data?.pages[0].data.count;
  const items = blockListQuery.data?.pages.flatMap(page => page.data.data);
  const filteredItems = items?.filter(item => item?.block_no);

  const columns = [
    {
      key: "date",
      render: item => <DateCell time={item.time} />,
      jsonFormat: item => {
        if (!item.time) {
          return "-";
        }

        return item.time;
      },
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 95,
    },
    {
      key: "block_no",
      render: item => <BlockCell hash={item.hash} no={item?.block_no ?? 0} />,
      title: <p className='w-full text-right'>Height</p>,
      visible: columnsVisibility.block_no,
      widthPx: 75,
    },
    {
      key: "slot_no",
      render: item => (
        <p className='text-right'>{formatNumber(item?.slot_no ?? 0)}</p>
      ),
      title: <p className='w-full text-right'>Slot</p>,
      visible: columnsVisibility.slot_no,
      widthPx: 80,
    },
    {
      key: "tx_count",
      render: item => <p className='text-right'>{item.tx_count}</p>,
      jsonFormat: item => {
        if (typeof item.tx_count === "undefined") {
          return "-";
        }

        return item.tx_count;
      },
      title: <p className='w-full text-right'>TXs</p>,
      visible: columnsVisibility.tx_count,
      widthPx: 50,
    },
    {
      key: "minted_by",
      render: item => (
        <PoolCell
          poolInfo={item.pool}
          poolImageUrl={generateImageUrl(item.pool.id, "ico", "pool")}
        />
      ),
      jsonFormat: item => {
        if (!item.pool?.id) {
          return "-";
        }

        const id = item.pool?.id;
        const ticker = item.pool?.meta?.ticker;
        const name = item.pool?.meta?.name;

        return ticker && name ? `[${ticker}] ${name}` : id;
      },
      title: "Minted by",
      visible: columnsVisibility.minted_by,
      widthPx: 160,
      className: "pl-2",
    },
    {
      key: "size",
      title: "Size",
      render: item => (
        <div className='text-right'>
          {
            <SizeCell
              maxSize={item.epoch_param?.max_block_size ?? 0}
              size={item.size}
            />
          }
        </div>
      ),
      jsonFormat: item => {
        const elapsedPercentage =
          (item?.size * 100) / (item.epoch_param?.max_block_size ?? 0);

        return (
          "Size: " +
          ((item?.size ?? 0) / 1024).toFixed(2) +
          "kB" +
          " Percentage: " +
          (elapsedPercentage ?? 0).toFixed(2) +
          "%"
        );
      },
      visible: columnsVisibility.size,
      widthPx: 90,
    },
  ];

  useEffect(() => {
    if (totalBlocks && totalBlocks !== totalItems) {
      setTotalItems(totalBlocks);
    }
  }, [totalBlocks, totalItems]);

  return (
    <>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full items-center justify-between gap-1'>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              Total of {formatNumber(totalItems)} blocks
            </h3>
          )}
          <div className='flex items-center gap-1 md:hidden'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={epochBlockTableOptions.map(item => {
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

        <div className='flex gap-1'>
          <TableSearchInput
            placeholder='Search your results...'
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full'
            showSearchIcon
            prefixes={[
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
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={epochBlockTableOptions.map(item => {
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
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={blockListQuery}
        items={filteredItems}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof EpochBlockListColumns) -
            columnsOrder.indexOf(b.key as keyof EpochBlockListColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
