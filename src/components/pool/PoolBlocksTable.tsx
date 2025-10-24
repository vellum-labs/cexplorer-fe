import { poolBlocksTableOptions } from "@/constants/tables/poolBlocksTableOptions";
import { useFetchBlocksList } from "@/services/blocks";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { usePoolBlocksTableStore } from "@/stores/tables/poolBlocksTableStore";
import type { PoolBlocksColumns } from "@/types/tableTypes";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "../table/ExportButton";
import GlobalTable from "../table/GlobalTable";
import { SizeCell } from "@vellumlabs/cexplorer-sdk";
import { ProtocolDot } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

interface Props {
  poolId: string;
}

const PoolBlocksTable = ({ poolId }: Props) => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/pool/$id" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolBlocksTableStore();
  const [totalItems, setTotalItems] = useState(0);

  const { data: basicData } = useFetchMiscBasic();
  const miscData = useMiscConst(basicData?.data.version.const);

  const poolBlocksQuery = useFetchBlocksList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    true,
    poolId,
  );

  const totalBlocks = poolBlocksQuery.data?.pages[0].data.count;
  const items = poolBlocksQuery.data?.pages.flatMap(page => page.data.data);
  const filteredItems = items?.filter(item => item?.block_no);

  const columns = [
    {
      key: "date",
      render: item => (
        <p title={item.time} className=''>
          <DateCell time={item.time} />
        </p>
      ),
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
      render: item => (
        <Link
          to='/block/$hash'
          params={{ hash: item.hash }}
          className='flex justify-end text-primary'
        >
          {formatNumber(item.block_no ?? 0)}
        </Link>
      ),
      title: <p className='w-full text-right'>Height</p>,
      visible: columnsVisibility.block_no,
      widthPx: 75,
    },
    {
      key: "epoch_no",
      render: item => <p className='text-right'>{item.epoch_no}</p>,
      title: <p className='w-full text-right'>Epoch</p>,
      visible: columnsVisibility.epoch_no,
      widthPx: 50,
    },
    {
      key: "slot_no",
      render: item => (
        <p className='text-right'>{formatNumber(item.slot_no)}</p>
      ),
      title: <p className='w-full text-right'>Slot</p>,
      visible: columnsVisibility.slot_no,
      widthPx: 80,
    },
    {
      key: "tx_count",
      render: item => <p className='text-right'>{item.tx_count}</p>,
      title: <p className='w-full text-right'>TXs</p>,
      visible: columnsVisibility.tx_count,
      widthPx: 50,
    },
    {
      key: "hash",
      render: item => (
        <Link
          to='/block/$hash'
          params={{ hash: item.hash }}
          className='flex justify-end text-primary'
        >
          {formatString(item.hash, "long")}
        </Link>
      ),
      jsonFormat: item => {
        if (!item.hash) {
          return "-";
        }

        return item.hash;
      },
      title: <p className='flex w-full justify-end'>Hash</p>,
      visible: columnsVisibility.hash,
      widthPx: 90,
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
    {
      key: "protocol",
      render: item => (
        <div className='flex items-center justify-end gap-1'>
          <ProtocolDot
            protNo={Number(`${item.proto_major}.${item.proto_minor}`)}
            miscData={miscData}
          />
          <p className='text-right'>{`${item.proto_major}.${item.proto_minor}`}</p>
        </div>
      ),
      jsonFormat: item => {
        if (!item.protocol) {
          return "-";
        }

        return `${item.protocol.major}.${item.protocol.minor}`;
      },
      title: <span className='flex w-full justify-end'>Protocol</span>,
      visible: columnsVisibility.protocol,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    if (totalBlocks && totalBlocks !== totalItems) {
      setTotalItems(totalBlocks);
    }
  }, [totalBlocks, totalItems]);

  return (
    <>
      <div className='flex items-center gap-1'>
        <ExportButton columns={columns} items={items} />
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          columnsOptions={poolBlocksTableOptions.map(item => {
            return {
              label: item.name,
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            };
          })}
        />
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={poolBlocksQuery}
        items={filteredItems}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof PoolBlocksColumns) -
            columnsOrder.indexOf(b.key as keyof PoolBlocksColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};

export default PoolBlocksTable;
