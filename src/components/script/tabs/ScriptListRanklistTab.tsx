import type { ScriptListData } from "@/types/scriptTypes";
import type {
  ScriptListRanklistTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { Badge } from "@/components/global/badges/Badge";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import SortBy from "@/components/ui/sortBy";

import { useFetchScriptList } from "@/services/script";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useScriptListRanklistTableStore } from "@/stores/tables/scriptListRanklistTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { scriptListRanklistOptions } from "@/constants/tables/scriptListRanklistTableOptions";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const ScriptListRanklistTab: FC = () => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page, order } = useSearch({ from: "/script/" });

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string | undefined>(order);

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useScriptListRanklistTableStore();

  const selectItems = [
    {
      key: "redeemer.count",
      value: "Reedemer Count",
    },
    {
      key: "tx",
      value: "Tx",
    },
    {
      key: "tx_payment_cred.out.sum",
      value: "Outsum",
    },
  ];

  const scriptListQuery = useFetchScriptList(
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    rows,
    debouncedTableSearch ? debouncedTableSearch : undefined,
    selectedItem as any,
  );

  const totalScripts = scriptListQuery.data?.pages[0].data.count;
  const items = scriptListQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<ScriptListData> = [
    {
      key: "order",
      render: () => {},
      title: "#",
      standByRanking: true,
      visible: columnsVisibility.order,
      widthPx: 30,
    },
    {
      key: "dapp",
      render: item => {
        if (!item?.hash && !item?.label?.label) {
          return "-";
        }

        return (
          <div className={`flex w-[calc(100%-40px)] flex-col`}>
            {item?.label?.label && (
              <Link
                to='/script/$hash'
                params={{ hash: item?.hash }}
                className='w-fit text-primary'
              >
                {item?.label?.label}
              </Link>
            )}
            <div className='flex items-center gap-1/2'>
              <Link
                to='/script/$hash'
                params={{ hash: item?.hash }}
                className={
                  item?.label?.label
                    ? "text-text-xs hover:text-grayTextPrimary"
                    : "text-text-sm text-primary"
                }
                disabled={!!item?.label?.label}
              >
                {formatString(item?.hash, "long")}
              </Link>
              <Copy copyText={item?.hash} size={item?.label?.label ? 10 : 13} />
            </div>
          </div>
        );
      },
      title: "Hash",
      jsonFormat: item => {
        if (!item?.hash) {
          return "-";
        }

        return item?.hash;
      },
      visible: columnsVisibility.dapp,
      widthPx: 120,
    },
    {
      key: "category",
      render: item => {
        if (!item?.label?.category) {
          return <p className='text-center'>-</p>;
        }

        return (
          <Badge color='blue' className='text-center'>
            {item?.label?.category}
          </Badge>
        );
      },
      title: <p className='text-center'>Category</p>,
      visible: columnsVisibility.category,
      widthPx: 50,
    },
    {
      key: "users",
      render: item => {
        if (!item?.stat.recent?.tx_payment_cred?.out?.count) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            {formatNumber(item?.stat.recent.tx_payment_cred.out.count)}
          </p>
        );
      },
      title: <p className='w-full text-right'>Users</p>,
      visible: columnsVisibility.users,
      widthPx: 50,
    },
    {
      key: "int_this_epoch",
      render: item => {
        if (!item?.stat?.recent?.redeemer?.count) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            {formatNumber(item?.stat.recent?.redeemer?.count)}
          </p>
        );
      },
      title: <p className='w-full text-right'>Interactions this epoch</p>,
      visible: columnsVisibility.int_this_epoch,
      widthPx: 80,
    },
    {
      key: "activity_change",
      render: item => {
        if (
          !item?.stat?.recent?.redeemer?.count ||
          !item?.stat?.previous?.redeemer?.count
        ) {
          return <p className='text-right'>-</p>;
        }

        const percent = (
          (item?.stat.recent.redeemer.count /
            item?.stat.previous.redeemer.count) *
          100
        ).toFixed(2);

        return <p className='text-right'>{percent}%</p>;
      },
      title: <p className='w-full text-right'>Activity Change</p>,
      visible: columnsVisibility.activity_change,
      widthPx: 80,
    },
    {
      key: "epoch_volume",
      render: item => {
        if (!item?.stat?.recent?.redeemer?.sum) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item?.stat?.recent?.redeemer?.sum} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Epoch Volume</p>,
      visible: columnsVisibility.epoch_volume,
      widthPx: 80,
    },
  ];

  useEffect(() => {
    if (totalScripts && totalScripts !== totalItems) {
      setTotalItems(totalScripts);
    }
  }, [totalScripts, totalItems]);

  return (
    <>
      <div className='py-1'>
        {scriptListQuery.isLoading || scriptListQuery.isFetching ? (
          <LoadingSkeleton height='27px' width={"220px"} />
        ) : totalItems > 0 ? (
          <h3 className='basis-[230px] text-nowrap'>
            Total of {formatNumber(totalItems)} scripts
          </h3>
        ) : (
          ""
        )}
      </div>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          <SortBy
            selectItems={selectItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <div className='flex justify-end md:hidden'>
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton
                columns={columns}
                items={items}
                currentPage={page ?? 1}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={scriptListRanklistOptions.map(item => {
                  return {
                    label: item.name,
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  };
                })}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-1'>
          <TableSearchInput
            placeholder='Search by script hash...'
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full '
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton
              columns={columns}
              items={items}
              currentPage={page ?? 1}
            />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={scriptListRanklistOptions.map(item => {
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
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={scriptListQuery}
        items={items}
        minContentWidth={1000}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof ScriptListRanklistTableColumns,
            ) -
            columnsOrder.indexOf(b.key as keyof ScriptListRanklistTableColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
