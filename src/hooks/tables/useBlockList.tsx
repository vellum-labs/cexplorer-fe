import type { BlocksListResponse } from "@/types/blockTypes";
import type { BlockListColumns, TableColumns } from "@/types/tableTypes";
import type { Dispatch, SetStateAction } from "react";

import { useFetchBlocksList } from "@/services/blocks";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useBlockListTableStore } from "@/stores/tables/blockListTableStore";
import { useEffect, useState } from "react";

import DateCell from "@/components/table/DateCell";
import PoolCell from "@/components/table/PoolCell";
import { SizeCell } from "@/components/table/SizeCell";

import { BlockCell } from "@/components/blocks/BlockCell";
import { ProtocolDot } from "@/components/global/ProtocolDot";
import { HashCell } from "@/components/tx/HashCell";
import { formatNumber, formatString } from "@/utils/format/format";
import { useSearchTable } from "./useSearchTable";

interface UseBlockList {
  totalItems: number;
  blockListQuery: ReturnType<typeof useFetchBlocksList>;
  columns: TableColumns<BlocksListResponse["data"]["data"][number]>;
  items: any[] | undefined;
  tableSearch: string;
  searchPrefix: string;
  columnsVisibility: BlockListColumns;
  setSearchPrefix: Dispatch<SetStateAction<string>>;
  setTableSearch: Dispatch<SetStateAction<string>>;
  setColumnVisibility: (storeKey: string, isVisible: boolean) => void;
}

export const useBlockList = ({
  page,
  storeKey,
  overrideRows,
  overrideTableSearch,
}: {
  page?: number;
  storeKey?: string;
  overrideRows?: number;
  overrideTableSearch?: string;
}): UseBlockList => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { columnsVisibility, setColumnVisibility, rows } =
    useBlockListTableStore(storeKey)();

  const [
    { debouncedTableSearch, tableSearch, searchPrefix },
    setTableSearch,
    setSearchPrefix,
  ] = useSearchTable({
    debounceFilter: tableSearch =>
      tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    validPrefixes: ["pool_id", "epoch_no", "hash", "slot_no", "block_no"],
  });

  const [totalItems, setTotalItems] = useState(0);

  const blockListQuery = useFetchBlocksList(
    overrideRows ?? rows,
    infiniteScrolling
      ? 0
      : overrideRows
        ? (page ?? 1) * overrideRows - overrideRows
        : (page ?? 1) * rows - rows,
    !debouncedTableSearch.includes(":"),
    searchPrefix === "pool_id" && debouncedTableSearch.includes("pool1")
      ? debouncedTableSearch
      : undefined,
    searchPrefix === "epoch_no" ? parseInt(debouncedTableSearch) : undefined,
    searchPrefix === "hash" ? debouncedTableSearch : undefined,
    searchPrefix === "slot_no" ? parseInt(debouncedTableSearch) : undefined,
    overrideTableSearch
      ? +overrideTableSearch
      : searchPrefix === "block_no"
        ? parseInt(debouncedTableSearch)
        : undefined,
  );

  const totalBlocks = blockListQuery.data?.pages[0].data.count;
  const items = blockListQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<BlocksListResponse["data"]["data"][number]> = [
    {
      key: "date",
      render: item => (
        <div title={item.time} className=''>
          <DateCell time={item.time} className='text-nowrap' />
        </div>
      ),
      jsonFormat: item => {
        if (!item.time) {
          return "-";
        }

        return item.time;
      },
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 75,
    },
    {
      key: "block_no",
      render: item => <BlockCell hash={item.hash} no={item.block_no} />,
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
        <PoolCell key={String(item.slot_no)} poolInfo={item.pool} />
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
    },
    {
      key: "hash",
      render: item => (
        <HashCell hash={item.hash} href='/block/$hash' formatType='shorter' />
      ),
      jsonFormat: item => {
        if (!item.hash) {
          return "-";
        }

        return item.hash;
      },
      title: "Hash",
      visible: columnsVisibility.hash,
      widthPx: 120,
    },
    {
      key: "epoch_slot_no",
      render: item => (
        <p className='text-right'>{formatNumber(item?.epoch_slot_no ?? 0)}</p>
      ),
      title: <p className='w-full text-right'>Epoch slot</p>,
      visible: columnsVisibility.epoch_slot_no,
      widthPx: 85,
    },
    {
      key: "vrf_key",
      render: item => (
        <p title={item.vrf_key}>
          {item.vrf_key ? formatString(item.vrf_key, "shorter", 6) : "-"}
        </p>
      ),
      jsonFormat: item => {
        if (!item.vrf_key) {
          return "-";
        }

        return item.vrf_key;
      },
      title: "VRF key",
      visible: columnsVisibility.vrf_key,
      widthPx: 85,
    },
    {
      key: "protocol",
      render: item => (
        <div className='flex items-center justify-end gap-2'>
          <ProtocolDot
            protNo={Number(`${item.proto_major}.${item.proto_minor}`)}
          />
          <p className='text-right'>{`${item.proto_major}.${item.proto_minor}`}</p>
        </div>
      ),
      title: <p className='w-full text-right'>Protocol</p>,
      visible: columnsVisibility.protocol,
      widthPx: 70,
    },
    {
      key: "cert_counter",
      render: item => (
        <p className='text-right'>{item.op_cert_counter ?? "-"}</p>
      ),
      title: <p className='w-full text-right'>Cert No</p>,
      visible: columnsVisibility.cert_counter,
      widthPx: 70,
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

  return {
    totalItems,
    columns,
    items,
    tableSearch,
    searchPrefix,
    blockListQuery,
    columnsVisibility,
    setSearchPrefix,
    setTableSearch,
    setColumnVisibility,
  };
};
