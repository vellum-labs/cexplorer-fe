import type { BlocksListResponse } from "@/types/blockTypes";
import type { BlockListColumns, TableColumns } from "@/types/tableTypes";
import type { Dispatch, SetStateAction } from "react";

import { useFetchBlocksList } from "@/services/blocks";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useBlockListTableStore } from "@/stores/tables/blockListTableStore";
import { useEffect, useState } from "react";

import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { SizeCell } from "@vellumlabs/cexplorer-sdk";

import { BlockCell } from "@/components/blocks/BlockCell";
import { ProtocolDot } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { useSearchTable } from "./useSearchTable";
import type { FilterState } from "./useFilterTable";
import { useFilterTable } from "./useFilterTable";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import type { FilterKey } from "./useDrepList";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "../useMiscConst";
import { useNavigate } from "@tanstack/react-router";

interface UseBlockList {
  totalItems: number;
  blockListQuery: ReturnType<typeof useFetchBlocksList>;
  columns: TableColumns<BlocksListResponse["data"]["data"][number]>;
  items: any[] | undefined;
  tableSearch: string;
  searchPrefix: string;
  columnsVisibility: BlockListColumns;
  hasFilter?: boolean;
  filter: FilterState;
  selectItems: { key: string; value: string }[];
  selectedItem: string | undefined;
  setSearchPrefix: Dispatch<SetStateAction<string>>;
  setTableSearch: Dispatch<SetStateAction<string>>;
  setColumnVisibility: (storeKey: string, isVisible: boolean) => void;
  setSelectedItem: Dispatch<SetStateAction<string | undefined>>;
  changeFilterByKey: (key: FilterKey, value?: string) => void;
}

interface BlockListArgs {
  page?: number;
  storeKey?: string;
  overrideRows?: number;
  overrideTableSearch?: string;
  order: "epoch_no" | "block_no" | "slot_no" | "size" | "tx_count" | undefined;
  restSearch: any;
}

export const useBlockList = ({
  page,
  storeKey,
  overrideRows,
  overrideTableSearch,
  order,
  restSearch,
}: BlockListArgs): UseBlockList => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { columnsVisibility, setColumnVisibility, rows } =
    useBlockListTableStore(storeKey)();

  const navigate = useNavigate();

  const [
    { debouncedTableSearch, tableSearch, searchPrefix },
    setTableSearch,
    setSearchPrefix,
  ] = useSearchTable({
    debounceFilter: tableSearch =>
      tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    validPrefixes: ["pool_id", "epoch_no", "hash", "slot_no", "block_no"],
  });

  const {
    filterVisibility,
    filter,
    hasFilter,
    anchorRefs,
    filterDraft,
    changeDraftFilter,
    changeFilterByKey,
    toggleFilter,
  } = useFilterTable({
    storeKey: "block_list",
    filterKeys: ["epoch_no", "pool_id", "proto"],
  });

  const [totalItems, setTotalItems] = useState(0);

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const miscConstDaily = miscConst?.epoch_stat?.daily;

  const getSelectedItem = (newOrder?: typeof order) => {
    switch (newOrder) {
      case "block_no":
        return "Height";
      case "epoch_no":
        return "Epoch";
      case "size":
        return "Size";
      case "slot_no":
        return "Epoch slot";
      case "tx_count":
        return "Tx count";
      default:
        return "";
    }
  };

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    order ? getSelectedItem(order) : undefined,
  );

  const selectItems = [
    {
      key: "Height",
      value: "Height",
    },
    {
      key: "Epoch",
      value: "Epoch",
    },
    {
      key: "Size",
      value: "Size",
    },
    {
      key: "Epoch slot",
      value: "Epoch slot",
    },
    {
      key: "Tx count",
      value: "Tx count",
    },
  ];

  const protocolVersions = Array.isArray(miscConstDaily)
    ? Array.from(
        new Set(
          miscConstDaily
            .map(item =>
              Array.isArray(item?.stat?.block_version)
                ? item.stat.block_version
                : [],
            )
            .flat()
            .map(item => String(item.version)),
        ),
      )
    : [];

  const blockListQuery = useFetchBlocksList(
    overrideRows ?? rows,
    infiniteScrolling
      ? 0
      : overrideRows
        ? (page ?? 1) * overrideRows - overrideRows
        : (page ?? 1) * rows - rows,
    !debouncedTableSearch.includes(":"),
    filter.pool_id
      ? filter.pool_id
      : searchPrefix === "pool_id" && debouncedTableSearch.includes("pool1")
        ? debouncedTableSearch
        : undefined,
    filter.epoch_no
      ? +filter.epoch_no
      : searchPrefix === "epoch_no"
        ? parseInt(debouncedTableSearch)
        : undefined,
    searchPrefix === "hash" ? debouncedTableSearch : undefined,
    searchPrefix === "slot_no" ? parseInt(debouncedTableSearch) : undefined,
    overrideTableSearch
      ? +overrideTableSearch
      : searchPrefix === "block_no"
        ? parseInt(debouncedTableSearch)
        : undefined,
    filter.proto ? filter.proto : undefined,
    order,
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
      title: (
        <p ref={anchorRefs?.epoch_no} className='w-full text-right'>
          Epoch
        </p>
      ),
      filter: {
        anchorRef: anchorRefs?.epoch_no,
        width: "170px",
        activeFunnel: !!filter.epoch_no,
        filterOpen: filterVisibility.epoch_no,
        filterButtonDisabled:
          !filterDraft.epoch_no ||
          /^\D+$/.test(filterDraft.epoch_no) ||
          (filter.epoch_no
            ? +filter.epoch_no === +filterDraft.epoch_no
            : false),
        onShow: e => toggleFilter(e, "epoch_no"),
        onFilter: () => changeFilterByKey("epoch_no", +filterDraft.epoch_no),
        onReset: () => changeFilterByKey("epoch_no"),
        filterContent: (
          <div className='flex h-[60px] w-full items-center justify-center px-1'>
            <TextInput
              onchange={value => changeDraftFilter("epoch_no", value)}
              placeholder='Filter by epoch...'
              value={filterDraft["epoch_no"] ?? ""}
              wrapperClassName='w-full'
            />
          </div>
        ),
      },
      visible: columnsVisibility.epoch_no,
      widthPx: 70,
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
      render: item => {
        if (item.epoch_no === null) {
          return <span>Genesis block</span>;
        }
        return (
          <PoolCell
            key={String(item.slot_no)}
            poolInfo={item.pool}
            poolImageUrl={generateImageUrl(item.pool.id, "ico", "pool")}
          />
        );
      },
      jsonFormat: item => {
        if (item.epoch_no === null) {
          return "Genesis block";
        }
        if (!item.pool?.id) {
          return "-";
        }

        const id = item.pool?.id;
        const ticker = item.pool?.meta?.ticker;
        const name = item.pool?.meta?.name;

        return ticker && name ? `[${ticker}] ${name}` : id;
      },
      title: <p ref={anchorRefs?.pool_id}>Minted by</p>,
      filter: {
        anchorRef: anchorRefs?.pool_id,
        activeFunnel: !!filter.pool_id,
        filterOpen: filterVisibility.pool_id,
        filterButtonDisabled:
          !filterDraft.pool_id ||
          !filterDraft.pool_id.includes("pool") ||
          (filter.pool_id ? filter.pool_id === filterDraft.pool_id : false),
        onShow: e => toggleFilter(e, "pool_id"),
        onFilter: () => changeFilterByKey("pool_id", filterDraft.pool_id),
        onReset: () => changeFilterByKey("pool_id"),
        filterContent: (
          <div className='flex h-[60px] w-full items-center justify-center px-1'>
            <TextInput
              onchange={value => changeDraftFilter("pool_id", value)}
              placeholder='Filter by pool id...'
              value={filterDraft["pool_id"] ?? ""}
              wrapperClassName='w-full'
            />
          </div>
        ),
      },
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
        <div className='flex items-center justify-end gap-1'>
          <ProtocolDot
            protNo={Number(`${item.proto_major}.${item.proto_minor}`)}
            miscData={miscConst}
          />
          <p className='text-right'>{`${item.proto_major}.${item.proto_minor}`}</p>
        </div>
      ),
      title: (
        <p ref={anchorRefs.proto} className='w-full text-right'>
          Protocol
        </p>
      ),
      filter: {
        anchorRef: anchorRefs?.proto,
        width: "200px",
        activeFunnel: !!filter.proto,
        filterOpen: filterVisibility.proto,
        filterButtonDisabled:
          !filterDraft.proto ||
          !/^\d+(\.\d+)?$/.test(filterDraft["proto"]) ||
          (filter.proto ? filter.proto === filterDraft.proto : false),
        onShow: e => toggleFilter(e, "proto"),
        onFilter: () => changeFilterByKey("proto", filterDraft.proto),
        onReset: () => changeFilterByKey("proto"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {(protocolVersions || []).map(version => (
              <label key={`${version}`} className='flex items-center gap-1'>
                <input
                  type='radio'
                  name='proto'
                  value={version}
                  disabled={
                    !!filterDraft["proto"] &&
                    !protocolVersions.includes(String(filterDraft["proto"]))
                  }
                  className='accent-primary'
                  checked={String(filterDraft["proto"]) === version}
                  onChange={e =>
                    changeDraftFilter("proto", e.currentTarget.value)
                  }
                />
                <span className='text-text-sm'>{version}</span>
              </label>
            ))}
            <TextInput
              onchange={value => changeDraftFilter("proto", value)}
              placeholder='Custom protocol...'
              value={
                !protocolVersions.includes(String(filterDraft["proto"]))
                  ? filterDraft["proto"]
                  : ""
              }
              wrapperClassName='w-full'
            />
          </div>
        ),
      },
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
      title: <p>Size</p>,
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
    if (!selectedItem) {
      return;
    }

    switch (selectedItem) {
      case "Height":
        navigate({
          search: {
            ...restSearch,
            order: "block_no",
          } as any,
        });
        return;
      case "Epoch":
        navigate({
          search: {
            ...restSearch,
            order: "epoch_no",
          } as any,
        });
        return;
      case "Size":
        navigate({
          search: {
            ...restSearch,
            order: "size",
          } as any,
        });
        return;
      case "Epoch slot":
        navigate({
          search: {
            ...restSearch,
            order: "slot_no",
          } as any,
        });
        return;
      case "Tx count":
        navigate({
          search: {
            ...restSearch,
            order: "tx_count",
          } as any,
        });
        return;
      default:
        return;
    }
  }, [selectedItem]);

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
    hasFilter,
    filter,
    selectedItem,
    selectItems,
    setSelectedItem,
    setSearchPrefix,
    setTableSearch,
    setColumnVisibility,
    changeFilterByKey,
  };
};
