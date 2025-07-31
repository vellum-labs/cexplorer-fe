import type { TxListTableColumns } from "@/types/tableTypes";
import type { TxBasicInfo } from "@/types/txTypes";
import type { Dispatch, SetStateAction } from "react";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import DateCell from "@/components/table/DateCell";
import { SizeCell } from "@/components/table/SizeCell";
import { HashCell } from "@/components/tx/HashCell";
import { Link } from "@tanstack/react-router";

import { useFetchMiscBasic } from "@/services/misc";
import { useFetchTxList } from "@/services/tx";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useTxListTableStore } from "@/stores/tables/txListTableStore";
import { useEffect, useState } from "react";
import { useMiscConst } from "../useMiscConst";

import { formatNumber } from "@/utils/format/format";
import { isHex } from "@/utils/isHex";
import { useSearchTable } from "./useSearchTable";

interface UseTxList {
  specifiedParams: string | true | undefined;
  totalItems: number;
  txListQuery: ReturnType<typeof useFetchTxList>;
  columns: any[];
  items: TxBasicInfo[] | undefined;
  tableSearch: string;
  setTableSearch: Dispatch<SetStateAction<string>>;
  columnsVisibility: TxListTableColumns;
  setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
}

interface UseTxListArgs {
  page: number | undefined;
  address?: string;
  asset?: string;
  stake?: string;
  script?: string;
  isDonationPage?: boolean;
  policyId?: string;
  storeKey?: string;
  overrideRows?: number;
  overrideTableSearch?: string;
}

export const useTxList = ({
  page,
  address,
  asset,
  isDonationPage,
  policyId,
  script,
  stake,
  storeKey,
  overrideRows,
  overrideTableSearch,
}: UseTxListArgs): UseTxList => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { rows, columnsVisibility, setColumnVisibility } =
    useTxListTableStore(storeKey)();

  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [totalItems, setTotalItems] = useState(0);

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable({
      debounceFilter: tableSearch =>
        tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    });

  const txListQuery = useFetchTxList(
    overrideRows ?? rows,
    infiniteScrolling
      ? 0
      : debouncedTableSearch
        ? 0
        : overrideRows
          ? (page ?? 1) * overrideRows - overrideRows
          : (page ?? 1) * rows - rows,
    overrideTableSearch
      ? overrideTableSearch
      : isHex(debouncedTableSearch)
        ? debouncedTableSearch
        : undefined,
    stake
      ? undefined
      : address
        ? debouncedTableSearch
          ? undefined
          : address
        : undefined,
    stake ? stake : undefined,
    asset ? asset : undefined,
    script ? script : undefined,
    isDonationPage ? 1 : undefined,
    policyId ? policyId : undefined,
  );

  const totalTxs = txListQuery.data?.pages[0].data.count;
  const items = txListQuery.data?.pages.flatMap(page => page.data.data);
  const specifiedParams =
    address || asset || stake || script || isDonationPage || policyId;

  const columns = [
    {
      key: "date",
      render: item => (
        <div title={item?.block?.time}>
          <DateCell time={item?.block?.time} />
        </div>
      ),
      jsonFormat: item => {
        if (!item?.block?.time) {
          return "-";
        }

        return item?.block?.time;
      },
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 60,
    },
    {
      key: "hash",
      render: item => <HashCell hash={item.hash} />,
      jsonFormat: item => {
        if (!item?.hash) {
          return "-";
        }

        return item?.hash;
      },
      title: "Hash",
      visible: columnsVisibility.hash,
      widthPx: 80,
    },
    {
      key: "block",
      render: item => (
        <div className='flex items-center justify-end gap-[2px] text-primary'>
          <Link
            to='/epoch/$no'
            params={{ no: item?.block?.epoch_no }}
            className='flex justify-end'
          >
            {formatNumber(item?.block?.epoch_no ?? 0)}
          </Link>
          /
          <Link
            to='/block/$hash'
            params={{ hash: item?.block?.hash }}
            className='flex justify-end'
          >
            {formatNumber(item?.block?.no ?? 0)}
          </Link>
        </div>
      ),
      jsonFormat: item =>
        formatNumber(item?.block?.epoch_no ?? 0) +
        " / " +
        formatNumber(item?.block?.no ?? 0),
      title: <p className='w-full text-right'>Epoch / Block</p>,
      visible: columnsVisibility.block,
      widthPx: 65,
    },
    {
      key: "total_output",
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item?.out_sum ?? 0} />
        </span>
      ),
      title: <p className='w-full text-right'>Total Output</p>,
      visible: columnsVisibility.total_output,
      widthPx: 75,
    },
    {
      key: "donation",
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item?.treasury_donation ?? 0} />
        </span>
      ),
      title: <p className='w-full text-right'>Treasury Donation</p>,
      visible: isDonationPage || columnsVisibility.donation,
      widthPx: 75,
    },
    {
      key: "fee",
      render: item => (
        <span className='flex items-center justify-end'>
          <AdaWithTooltip data={item?.fee ?? 0} />
        </span>
      ),
      title: <p className='w-full text-right'>Fee</p>,
      visible: columnsVisibility.fee,
      widthPx: 75,
    },
    {
      key: "size",
      render: item => (
        <SizeCell
          size={item.size}
          maxSize={miscConst?.epoch_param.max_tx_size ?? 0}
        />
      ),

      jsonFormat: item => {
        const elapsedPercentage =
          (item?.size * 100) / (miscConst?.epoch_param?.max_tx_size ?? 0);

        return (
          "Size: " +
          ((item?.size ?? 0) / 1024).toFixed(2) +
          "kB" +
          " Percentage: " +
          (elapsedPercentage ?? 0).toFixed(2) +
          "%"
        );
      },
      title: <p className='w-full text-right'>Size</p>,
      visible: columnsVisibility.size,
      widthPx: 55,
    },
    {
      key: "script_size",
      render: item => (
        <span className='flex justify-end'>
          {formatNumber(item?.script_size)}
        </span>
      ),
      jsonFormat: item => {
        return item?.script_size;
      },
      title: <span className='flex justify-end'>Script size</span>,
      visible: columnsVisibility.script_size,
      widthPx: 35,
    },
  ];

  useEffect(() => {
    if (totalTxs && totalTxs !== totalItems) {
      setTotalItems(totalTxs);
    }
  }, [totalTxs, totalItems]);

  return {
    specifiedParams,
    totalItems,
    txListQuery,
    columns,
    items,
    tableSearch,
    columnsVisibility,
    setColumnVisibility,
    setTableSearch,
  };
};
