import { BlockCell } from "@/components/blocks/BlockCell";
import { EpochCell } from "@/components/epoch/EpochCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { HashCell } from "@/components/tx/HashCell";
import { poolDeregistrationsTableOptions } from "@/constants/tables/poolDeregistrationsOptions";
import { useFetchPoolDeregistrations } from "@/services/tx";
import { usePoolDeregistrationsTableStore } from "@/stores/tables/poolDeregistrationsTableStore";
import type { PoolRegistrationsData } from "@/types/poolTypes";
import type {
  PoolRegistrationsColumns,
  TableColumns,
} from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatRemainingTime } from "@/utils/format/formatRemainingTime";
import { PageBase } from "@/components/global/pages/PageBase";

export const PoolDeregistrationsPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const { page } = useSearch({ from: "/pool/deregistrations" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolDeregistrationsTableStore();

  const query = useFetchPoolDeregistrations(rows, (page ?? 1) * rows - rows);
  const count = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<PoolRegistrationsData> = [
    {
      key: "date",
      render: item => (
        <div title={item.block.time} className=''>
          <DateCell time={item.block.time} />
        </div>
      ),
      jsonFormat: item => {
        if (!item.block.time) {
          return "-";
        }

        return item.block.time;
      },
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 30,
    },
    {
      key: "longetivity",
      render: item => {
        const timeDifference =
          new Date(item.block.time).getTime() -
          new Date(item.data.registered).getTime();

        return <div>{formatRemainingTime(timeDifference / 1000)}</div>;
      },
      title: "Longetivity",
      visible: columnsVisibility.longetivity,
      widthPx: 40,
    },
    {
      key: "view",
      render: item => (
        <PoolCell
          poolInfo={{
            id: item.data.view,
            meta: item.data.meta,
          }}
          poolImageUrl={generateImageUrl(item.data.view, "ico", "pool")}
        />
      ),
      jsonFormat: item => {
        if (!item?.data.view) {
          return "-";
        }

        return item?.data?.view;
      },
      title: <p>Pool</p>,
      visible: columnsVisibility.view,
      widthPx: 50,
    },
    {
      key: "deposit",
      render: item => (
        <div className='flex justify-end'>
          <AdaWithTooltip data={item.tx.deposit} />
        </div>
      ),
      title: <p className='w-full text-right'>Deposit</p>,
      visible: columnsVisibility.deposit,
      widthPx: 40,
    },
    {
      key: "fee",
      render: item => (
        <div className='flex justify-end'>
          <AdaWithTooltip data={item.tx.fee} />
        </div>
      ),
      title: <p className='w-full text-right'>Fee</p>,
      visible: columnsVisibility.fee,
      widthPx: 50,
    },
    {
      key: "hash",
      render: item => <HashCell hash={item.tx.hash} />,
      jsonFormat: item => {
        if (!item.tx.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: "TX hash",
      visible: columnsVisibility.hash,
      widthPx: 40,
    },
    {
      key: "epoch_block",
      render: item => (
        <div className='flex items-center justify-end gap-1/2'>
          <EpochCell no={item.block.epoch_no} /> /{" "}
          <BlockCell hash={item.block.hash} no={item.block.no} />
        </div>
      ),
      jsonFormat: item => {
        if (!item.block.epoch_no || !item.block.no) {
          return "-";
        }

        return `${item.block.epoch_no}/${item.block.no}`;
      },
      title: <p className='w-full text-right'>Epoch/Block</p>,
      visible: columnsVisibility.epoch_block,
      widthPx: 40,
    },
  ];

  useEffect(() => {
    if (count && count !== totalItems) {
      setTotalItems(count);
    }
  }, [count, totalItems]);

  return (
    <PageBase
      metadataTitle='poolDeregistrations'
      title='Pool deregistrations'
      breadcrumbItems={[{ label: "Pool deregistrations" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full items-center justify-between gap-1'>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              Total of {formatNumber(totalItems ?? 0)} deregistrations
            </h3>
          )}
          <div className='flex items-center gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={poolDeregistrationsTableOptions.map(item => {
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
          itemsPerPage={20}
          scrollable
          query={query}
          items={items ?? []}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof PoolRegistrationsColumns) -
              columnsOrder.indexOf(b.key as keyof PoolRegistrationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
