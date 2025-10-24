import AddressCell from "@/components/address/AddressCell";
import { BlockCell } from "@/components/blocks/BlockCell";
import { EpochCell } from "@/components/epoch/EpochCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@/components/global/badges/AddressTypeInitialsBadge";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { HashCell } from "@/components/tx/HashCell";
import { stakeRegistrationsTableOptions } from "@/constants/tables/stakeRegistrationsOptions";
import { useFetchStakeRegistrations } from "@/services/tx";
import { useStakeRegistrationsTableStore } from "@/stores/tables/stakeRegistrationsTableStore";
import type { StakeRegistrationsData } from "@/types/stakeTypes";
import type {
  StakeRegistrationsColumns,
  TableColumns,
} from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

export const StakeRegistrationsPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const { page } = useSearch({ from: "/stake/registrations" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useStakeRegistrationsTableStore();

  const query = useFetchStakeRegistrations(rows, (page ?? 1) * rows - rows);
  const count = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<StakeRegistrationsData> = [
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
      key: "type",
      render: item => {
        return <AddressTypeInitialsBadge address={item.data.view} />;
      },
      title: "Type",
      visible: columnsVisibility.type,
      widthPx: 30,
    },
    {
      key: "view",
      render: item => <AddressCell address={item.data.view} />,
      jsonFormat: item => {
        if (!item?.data.view) {
          return "-";
        }

        return item?.data?.view;
      },
      title: <p>Stake key</p>,
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
      metadataTitle='stakeRegistrations'
      title='Stake registrations'
      breadcrumbItems={[{ label: "Stake registrations" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full items-center justify-between gap-1'>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              Total of {formatNumber(totalItems ?? 0)} registrations
            </h3>
          )}
          <div className='flex items-center gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={stakeRegistrationsTableOptions.map(item => {
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
              columnsOrder.indexOf(a.key as keyof StakeRegistrationsColumns) -
              columnsOrder.indexOf(b.key as keyof StakeRegistrationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
