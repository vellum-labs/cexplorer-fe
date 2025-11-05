import { BlockCell } from "@/components/blocks/BlockCell";
import { EpochCell } from "@/components/epoch/EpochCell";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { PurposeBadge } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { contractInteractionsTableOptions } from "@/constants/tables/contractInteractionsTableOptions";
import { useFetchContractTransactions } from "@/services/tx";
import { useContractInteractionsTableStore } from "@/stores/tables/contractInteractionsTableStore";
import type { ContractInteractionsData } from "@/types/contractTypes";
import type {
  ContractInteractionsColumns,
  TableColumns,
} from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

export const ContractTransactionsPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const { page } = useSearch({ from: "/contract/interactions" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useContractInteractionsTableStore();

  const query = useFetchContractTransactions(rows, (page ?? 1) * rows - rows);
  const count = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);

  console.log("items", items);

  const columns: TableColumns<ContractInteractionsData> = [
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
        return item.data.type ? (
          <Badge color='blue' rounded>
            {item.data.type}
          </Badge>
        ) : (
          <span>-</span>
        );
      },
      jsonFormat: item => {
        return item.data.type || "-";
      },
      title: "Type",
      visible: columnsVisibility.type,
      widthPx: 30,
    },
    {
      key: "purpose",
      render: item => {
        return <PurposeBadge purpose={item.data.purpose} />;
      },
      title: "Purpose",
      visible: columnsVisibility.purpose,
      widthPx: 30,
    },
    {
      key: "view",
      render: item => (
        <HashCell hash={item?.data.script_hash} href='/script/$hash' />
      ),
      jsonFormat: item => {
        if (!item?.data.script_hash) {
          return "-";
        }

        return item?.data?.script_hash;
      },
      title: <p>Script hash</p>,
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
      key: "unit_steps",
      render: item => (
        <div className='flex justify-end'>
          {formatNumber(item.data.unit_steps)}
        </div>
      ),
      title: <p className='w-full text-right'>Unit steps</p>,
      visible: columnsVisibility.unit_steps,
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
      widthPx: 50,
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
      metadataTitle='contractInteractions'
      title='Contract interactions'
      breadcrumbItems={[{ label: "Contract interactions" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full items-center justify-between gap-1'>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[250px]'>
              Total of {formatNumber(totalItems ?? 0)} interactions
            </h3>
          )}
          <div className='flex items-center gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={contractInteractionsTableOptions.map(item => {
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
              columnsOrder.indexOf(a.key as keyof ContractInteractionsColumns) -
              columnsOrder.indexOf(b.key as keyof ContractInteractionsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
