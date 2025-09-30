import type {
  BlockDetailResponseData,
  BlockDetailResponseDataTxsItem,
} from "@/types/blockTypes";
import type { BlockDetailColumns } from "@/types/tableTypes";
import type { FC } from "react";

import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import DateCell from "@/components/table/DateCell";
import GlobalTable from "@/components/table/GlobalTable";
import { formatNumber, formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";

import { useBlockDetailTableStore } from "@/stores/tables/blockDetailTableStore";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import ExportButton from "@/components/table/ExportButton";
import { blocksDetailTableOptions } from "@/constants/tables/blocksDetailTableOptions";
import type { UseQueryResult } from "@tanstack/react-query";

interface BlockDetailTableProps {
  txs: BlockDetailResponseDataTxsItem[] | undefined;
  blockDetail: UseQueryResult<BlockDetailResponseData, Error>;
}

export const BlockDetailTable: FC<BlockDetailTableProps> = ({
  txs,
  blockDetail,
}) => {
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useBlockDetailTableStore();

  const columns = [
    {
      key: "date",
      render: item => (
        <p>
          <DateCell time={item.block.time} />
        </p>
      ),
      jsonFormat: item => {
        if (!item.block.time) {
          return "-";
        }

        return item.block.time;
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 80,
    },
    {
      key: "hash",
      render: item => (
        <p className='cursor-pointer text-primary'>
          <Link
            to='/tx/$hash'
            params={{
              hash: item.hash,
            }}
            className='text-primary'
          >
            {formatString(item.hash, "long")}
          </Link>
        </p>
      ),
      jsonFormat: item => {
        if (!item.hash) {
          return "-";
        }

        return item.hash;
      },
      title: <p>Transaction Hash</p>,
      visible: columnsVisibility.hash,
      widthPx: 50,
    },
    {
      key: "block",
      render: item => {
        return <p className='text-right'>{formatNumber(item.block.no ?? 0)}</p>;
      },
      jsonFormat: item => {
        if (typeof item.block.no === "undefined" || item.block.no === null) {
          return "-";
        }
        return item.block.no;
      },
      title: <p className='w-full text-right'>Block</p>,
      visible: columnsVisibility.block,
      widthPx: 50,
    },
    {
      key: "total_output",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.out_sum} />
        </p>
      ),
      title: <p className='w-full text-right'>Total Output</p>,
      visible: columnsVisibility.total_ouput,
      widthPx: 50,
    },
    {
      key: "fee",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.fee} />
        </p>
      ),
      title: <p className='w-full text-right'>Fee</p>,
      visible: columnsVisibility.fee,
      widthPx: 50,
    },
    {
      key: "size",
      render: item => (
        <p className='text-right'>{(item.size / 1024).toFixed(2)}kB</p>
      ),
      title: <p className='w-full text-right'>Size</p>,
      visible: columnsVisibility.size,
      widthPx: 30,
    },
  ];

  return (
    <>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-lg font-semibold'>Transactions</h1>
        <div className='flex gap-2'>
          <ExportButton columns={columns} items={txs} />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={blocksDetailTableOptions.map(item => {
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
      <GlobalTable
        type='default'
        totalItems={txs?.length}
        items={txs}
        scrollable
        query={blockDetail}
        columns={columns.sort(
          (a, b) =>
            columnsOrder.indexOf(a.key as keyof BlockDetailColumns) -
            columnsOrder.indexOf(b.key as keyof BlockDetailColumns),
        )}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
