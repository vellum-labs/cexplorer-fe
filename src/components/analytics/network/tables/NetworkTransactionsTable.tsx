import type { useFetchEpochAnalytics } from "@/services/analytics";
import type { FC } from "react";
import type { NetworkTPSTableColumns, TableColumns } from "@/types/tableTypes";

import GlobalTable from "@/components/table/GlobalTable";

import { useNetworkTPSTableStore } from "@/stores/tables/networkTPSTableStore";

import { formatNumber } from "@/utils/format/format";

interface NetworkTransactionsTableProps {
  query: ReturnType<typeof useFetchEpochAnalytics>;
  items: {
    timeframe: string;
    transactions: number | undefined;
    tps: string;
    max_tps: string;
  }[];
}

export const NetworkTransactionsTable: FC<NetworkTransactionsTableProps> = ({
  query,
  items,
}) => {
  const { columnsOrder, rows, columnsVisibility, setColumsOrder } =
    useNetworkTPSTableStore();

  const columns: TableColumns<(typeof items)[0]> = [
    {
      key: "timeframe",
      render: item => <p>{item.timeframe}</p>,
      title: <p>Timeframe</p>,
      visible: columnsVisibility.timeframe,
      widthPx: 50,
    },
    {
      key: "transactions",
      render: item => (
        <p className='text-right'>{formatNumber(item.transactions)}</p>
      ),
      title: <p className='w-full text-right'>Transactions</p>,
      visible: columnsVisibility.transactions,
      widthPx: 50,
    },
    {
      key: "tps",
      render: item => <p className='text-right'>{formatNumber(item.tps)}</p>,
      title: <p className='w-full text-right'>TPS</p>,
      visible: columnsVisibility.tps,
      widthPx: 50,
    },
    {
      key: "max_tps",
      render: item => (
        <p className='text-right'>{formatNumber(item.max_tps)}</p>
      ),
      title: <p className='w-full text-right'>Max TPS</p>,
      visible: columnsVisibility.max_tps,
      widthPx: 50,
    },
  ];

  return (
    <GlobalTable
      type='default'
      totalItems={items.length}
      itemsPerPage={rows}
      rowHeight={69}
      pagination
      scrollable
      query={query}
      items={items}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof NetworkTPSTableColumns) -
          columnsOrder.indexOf(b.key as keyof NetworkTPSTableColumns)
        );
      })}
      minContentWidth={500}
      onOrderChange={setColumsOrder}
    />
  );
};
