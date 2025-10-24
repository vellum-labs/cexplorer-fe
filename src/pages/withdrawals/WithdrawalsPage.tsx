import AddressCell from "@/components/address/AddressCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { HashCell } from "@/components/tx/HashCell";
import { withdrawalsTableOptions } from "@/constants/tables/withdrawalsTableOptions";
import { useFetchWithdrawals } from "@/services/account";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useWithdrawalsTableStore } from "@/stores/tables/withdrawalsTableStore";
import type { Withdrawal } from "@/types/accountTypes";
import type { TableColumns, WithdrawalsColumns } from "@/types/tableTypes";
import { formatNumber, formatTimeAgo } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

export const WithdrawalsPage = () => {
  const { page } = useSearch({ from: "/withdrawals/" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useWithdrawalsTableStore();

  const delegationQuery = useFetchWithdrawals(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
  );
  const [totalItems, setTotalItems] = useState(0);
  const items = delegationQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = delegationQuery.data?.pages[0].data.count;

  const withdrawalColumns: TableColumns<Withdrawal> = [
    {
      key: "date",
      render: item => {
        return <>{formatTimeAgo(item.block.time)}</>;
      },
      jsonFormat: item => {
        if (!item?.block?.time) {
          return "-";
        }

        return item.block.time;
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 70,
    },
    {
      key: "epoch",
      render: item => (
        <Link
          to='/epoch/$no'
          params={{ no: String(item?.block?.epoch_no) }}
          className='flex justify-end text-primary'
        >
          {formatNumber(item?.block?.epoch_no ?? 0)}
        </Link>
      ),
      title: <p className='w-full text-right'>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 35,
    },
    {
      key: "address",
      render: item => (
        <AddressCell address={item.view} amount={item.account.live_stake} />
      ),
      jsonFormat: item => {
        if (!item?.view) {
          return "-";
        }

        return item.view;
      },
      title: "Address",
      visible: columnsVisibility.address,
      widthPx: 110,
    },
    {
      key: "amount_controlled",
      render: item => (
        <div className='flex flex-col items-end gap-1/2'>
          <AdaWithTooltip data={item?.account.live_stake ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <span>Amount Controlled</span>
        </div>
      ),
      visible: columnsVisibility.amount_controlled,
      widthPx: 75,
    },
    {
      key: "amount_withdrawn",
      render: item => (
        <div className='flex flex-col items-end gap-1/2'>
          <AdaWithTooltip data={item?.amount ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <span>Amount Withdrawn</span>
        </div>
      ),
      visible: columnsVisibility.amount_withdrawn,
      widthPx: 80,
    },
    {
      key: "delegated_to",
      render: item => (
        <div className='flex items-center gap-1/2'>
          <PoolCell
            poolInfo={item.pool.live}
            poolImageUrl={generateImageUrl(item.pool.live.id, "ico", "pool")}
          />
        </div>
      ),
      jsonFormat: item => {
        if (!item?.pool?.live || !item?.pool?.live?.id) {
          return "-";
        }

        const id = item?.pool?.live?.id;
        const ticker = item?.pool?.live?.meta?.ticker;
        const name = item?.pool?.live?.meta?.name;

        return ticker && name ? `[${ticker}] ${name}` : id;
      },
      title: "Delegation",
      visible: columnsVisibility.delegated_to,
      widthPx: 160,
    },
    {
      key: "tx",
      render: item => {
        return <HashCell hash={item.tx.hash} />;
      },
      jsonFormat: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: "Tx",
      visible: columnsVisibility.tx,
      widthPx: 80,
    },
  ];

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <PageBase
      metadataTitle='withdrawalsList'
      title='Withdrawals'
      breadcrumbItems={[{ label: "Withdrawals" }]}
    >
      <div className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 ml-auto flex w-fit justify-end gap-1'>
          <ExportButton columns={withdrawalColumns} items={items} />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={withdrawalsTableOptions.map(item => {
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
          rowHeight={65}
          scrollable
          query={delegationQuery}
          items={items}
          columns={withdrawalColumns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof WithdrawalsColumns) -
              columnsOrder.indexOf(b.key as keyof WithdrawalsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
    </PageBase>
  );
};
