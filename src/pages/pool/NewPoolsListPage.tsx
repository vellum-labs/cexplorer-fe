import type { PoolData } from "@/types/poolTypes";
import type { NewPoolsColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { Copy } from "@vellumlabs/cexplorer-sdk";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { Check, X } from "lucide-react";

import { useFetchPoolsList } from "@/services/pools";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useNewPoolsListTableStore } from "@/stores/tables/newPoolsListTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { EpochCell } from "@/components/epoch/EpochCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { newPoolsTableOptions } from "@/constants/tables/newPoolsTableOptions";
import { formatString } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { PageBase } from "@/components/global/pages/PageBase";

export const NewPoolsListPage: FC = () => {
  const { page } = useSearch({ from: "/new-pools/" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useNewPoolsListTableStore();

  const [totalItems, setTotalItems] = useState<number>(0);

  const poolsListQuery = useFetchPoolsList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    "desc",
    "new",
  );

  const totalPools = poolsListQuery.data?.pages[0].data.count;
  const items = poolsListQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<PoolData> = [
    {
      key: "date",
      render: item => <DateCell time={item?.pool_update?.active?.tx.time} />,
      jsonFormat: item => {
        if (!item?.pool_update?.active?.tx.time) {
          return "-";
        }

        return item?.pool_update?.active?.tx.time;
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "pool",
      render: item => (
        <div className='flex flex-col'>
          <Link to='/pool/$id' params={{ id: item.pool_id }}>
            <span
              title={item.pool_id}
              className='cursor-pointer text-text-sm text-primary'
            >
              {item.pool_name?.ticker && `[${item.pool_name.ticker}] `}
              {item.pool_name?.name && item.pool_name.name}
            </span>
          </Link>
          <div className='item-center flex gap-1'>
            <Link to='/pool/$id' params={{ id: item.pool_id }}>
              <span
                className={`${item.pool_name?.ticker ? "text-text-xs" : "text-text-sm"} text-primary`}
              >
                {formatString(item.pool_id, "long")}
              </span>
            </Link>
            <Copy
              copyText={item.pool_id}
              size={10}
              className='stroke-grayText translate-y-[6px]'
            />
          </div>
        </div>
      ),
      jsonFormat: item => {
        if (!item.pool_name.ticker && !item.pool_name.name && !item.pool_id) {
          return "-";
        }

        let format = "";

        if (item.pool_name.ticker || item.pool_name.name) {
          format += `Name: [${item.pool_name?.ticker ? item.pool_name?.ticker : ""}] ${item.pool_name?.name ? item.pool_name?.name : ""}, `;
        }

        if (item.pool_id) {
          format += `ID: ${item.pool_id}`;
        }

        return format;
      },
      title: "Pool",
      visible: columnsVisibility.pool,
      widthPx: 90,
    },
    {
      key: "epoch",
      render: item => (
        <EpochCell no={item.active_epochs} substractFromCurrent />
      ),
      title: <p className='w-full text-right'>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 15,
    },
    {
      key: "fees",
      render: item => (
        <div className='flex flex-col text-right text-grayTextPrimary'>
          <span>
            {item?.pool_update?.active?.margin
              ? (item.pool_update.active.margin * 100).toFixed(2)
              : 0}
            %
          </span>
          <span>
            <AdaWithTooltip data={item?.pool_update?.active?.fixed_cost ?? 0} />
          </span>
        </div>
      ),
      jsonFormat: item => {
        let format = "";

        if (
          !item?.pool_update?.active?.margin &&
          !item?.pool_update?.active?.fixed_cost
        ) {
          return "-";
        }

        if (item?.pool_update?.active?.margin) {
          format += `Percentage: ${(item.pool_update.active.margin * 100).toFixed(2)}%`;
        }

        if (item?.pool_update?.active?.fixed_cost) {
          format += `, Amount: ${lovelaceToAda(item?.pool_update?.active?.fixed_cost ?? 0)}`;
        }

        return format;
      },
      title: <p className='w-full text-right'>Fees</p>,
      visible: columnsVisibility.fees,
      widthPx: 50,
    },
    {
      key: "pledge",
      render: item => {
        const pledge = item?.pool_update.live?.pledge ?? 0;
        const pledged = item?.pledged ?? 0;

        return (
          <div className='flex items-center justify-end gap-1/2'>
            {pledged >= pledge ? (
              <Check size={11} className='translate-y-[1px] stroke-[#17B26A]' />
            ) : (
              <X size={11} className='translate-y-[1px] stroke-[#F04438]' />
            )}

            <AdaWithTooltip data={item.pool_update?.active?.pledge ?? 0} />
          </div>
        );
      },
      title: <p className='w-full text-right'>Pledge</p>,
      visible: columnsVisibility.pledge,
      widthPx: 40,
    },
    {
      key: "tx_hash",
      render: item => <HashCell hash={item?.pool_update?.active?.tx.hash} />,
      jsonFormat: item => {
        if (!item?.pool_update?.active?.tx.hash) {
          return "-";
        }

        return item?.pool_update?.active?.tx.hash;
      },
      title: <p>Tx Hash</p>,
      visible: columnsVisibility.tx_hash,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalPools && totalPools !== totalItems) {
      setTotalItems(totalPools);
    }
  }, [totalPools, totalItems]);

  return (
    <PageBase
      metadataTitle='newPoolsList'
      title='New Pools'
      breadcrumbItems={[{ label: "New Pools" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <h3>Welcome, new pool operators!</h3>

          <div className='mb-2 ml-auto flex w-fit justify-end gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={newPoolsTableOptions.map(item => {
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
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          itemsPerPage={rows}
          rowHeight={65}
          scrollable
          query={poolsListQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof NewPoolsColumns) -
              columnsOrder.indexOf(b.key as keyof NewPoolsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
