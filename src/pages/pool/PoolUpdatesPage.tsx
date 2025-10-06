import Copy from "@/components/global/Copy";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import DateCell from "@/components/table/DateCell";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import { Tooltip } from "@/components/ui/tooltip";
import type { PoolData } from "@/types/poolTypes";
import type { PoolUpdatesColumns, TableColumns } from "@/types/tableTypes";
import { Check, ExternalLink, X } from "lucide-react";
import type { FC } from "react";

import { poolUpdatesTableOptions } from "@/constants/tables/poolUpdatesTableOptions";

import { useFetchPoolsList } from "@/services/pools";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { usePoolUpdatesTableStore } from "@/stores/tables/poolUpdatesTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { formatNumber, formatString } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { PageBase } from "@/components/global/pages/PageBase";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const PoolUpdatesPage: FC = () => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/pool-updates/" });

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolUpdatesTableStore();

  const poolsListQuery = useFetchPoolsList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    "desc",
    "update",
    !debouncedTableSearch.includes("pool1") &&
      debouncedTableSearch.replace("Pool Name:", "").trim().length > 0
      ? debouncedTableSearch
      : undefined,
    debouncedTableSearch.includes("pool1")
      ? debouncedTableSearch.replace("Pool ID:", "")
      : undefined,
  );

  const totalPools = poolsListQuery.data?.pages[0].data.count;
  const items = poolsListQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<PoolData> = [
    {
      key: "date",
      render: item => {
        if (
          !item?.pool_update?.active?.tx?.time &&
          !item?.pool_update?.live?.tx?.time
        ) {
          return "-";
        }

        return (
          <DateCell
            time={
              item?.pool_update?.active?.tx?.time ||
              item?.pool_update?.live?.tx?.time
            }
          />
        );
      },
      jsonFormat: item => {
        if (
          !item?.pool_update?.active?.tx?.time &&
          !item?.pool_update?.live?.tx?.time
        ) {
          return "-";
        }

        return (
          item?.pool_update?.active?.tx?.time ||
          item?.pool_update?.live?.tx?.time
        );
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "epoch",
      render: item => {
        if (
          !item?.pool_update?.active?.active_epoch_no &&
          !item?.pool_update?.live?.active_epoch_no
        ) {
          return <p className='text-right'>-</p>;
        }

        return (
          <Link
            to='/epoch/$no'
            params={{
              no: String(
                item?.pool_update?.active?.active_epoch_no ||
                  item?.pool_update?.live?.active_epoch_no,
              ),
            }}
            className='text-primary'
          >
            <p className='text-right'>
              {item?.pool_update?.active?.active_epoch_no ||
                item?.pool_update?.live?.active_epoch_no}
            </p>
          </Link>
        );
      },
      title: <p className='w-full text-right'>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 30,
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
      widthPx: 100,
    },
    {
      key: "active_stake",
      render: item => {
        if (!item?.active_stake && !item?.live_stake) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            {item?.active_stake ? (
              <AdaWithTooltip data={item?.active_stake} />
            ) : (
              <AdaWithTooltip data={item?.live_stake as number} />
            )}
          </p>
        );
      },
      title: <p className='w-full text-right'>Active Stake</p>,
      visible: columnsVisibility.active_stake,
      widthPx: 45,
    },
    {
      key: "fees",
      render: item => {
        return (
          <div className='flex flex-col text-right'>
            <span>
              {item?.pool_update?.active?.margin ? (
                <>{(item.pool_update.active.margin * 100).toFixed(2)}%</>
              ) : (
                "-"
              )}
            </span>
            <span>
              {item?.pool_update?.active?.fixed_cost ? (
                <AdaWithTooltip
                  data={item?.pool_update?.active?.fixed_cost ?? 0}
                />
              ) : (
                "-"
              )}
            </span>
          </div>
        );
      },
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
        if (
          (!item?.pool_update.live?.pledge &&
            !item?.pool_update.active?.pledge) ||
          !item?.pledged
        ) {
          return <p className='text-right'>-</p>;
        }

        const pledge =
          item?.pool_update.live?.pledge || !item?.pool_update.active?.pledge;
        const pledged = item?.pledged;

        return (
          <div className='flex items-center justify-end gap-1/2'>
            <Tooltip
              content={
                <div className='flex w-[60px] items-center gap-1/2'>
                  <span>
                    <AdaWithTooltip data={pledged} />
                  </span>
                </div>
              }
            >
              <span className='w-[60px] whitespace-nowrap text-grayTextPrimary'>
                <AdaWithTooltip data={item.pool_update?.active?.pledge ?? 0} />
              </span>
            </Tooltip>
            {pledged >= (pledge as number) ? (
              <Check size={11} className='translate-y-[1px] stroke-[#17B26A]' />
            ) : (
              <X size={11} className='translate-y-[1px] stroke-[#F04438]' />
            )}
          </div>
        );
      },
      title: <p className='w-full text-right'>Pledge</p>,
      visible: columnsVisibility.pledge,
      widthPx: 55,
    },
    {
      key: "tx_hash",
      render: item => {
        if (
          !item?.pool_update?.active?.tx?.hash &&
          !item?.pool_update?.live?.tx?.hash
        ) {
          return "-";
        }

        return (
          <Link
            to='/tx/$hash'
            params={{
              hash:
                item?.pool_update?.active?.tx?.hash ||
                item?.pool_update?.live?.tx?.hash,
            }}
            className='text-primary'
          >
            {formatString(
              item?.pool_update?.active?.tx?.hash ||
                item?.pool_update?.live?.tx?.hash,
              "long",
            )}
          </Link>
        );
      },
      jsonFormat: item => {
        if (
          !item?.pool_update?.active?.tx?.hash &&
          !item?.pool_update?.live?.tx?.hash
        ) {
          return "-";
        }

        return (
          item?.pool_update?.active?.tx?.hash ||
          item?.pool_update?.live?.tx?.hash
        );
      },
      title: <p>Transaction Hash</p>,
      visible: columnsVisibility.tx_hash,
      widthPx: 60,
    },
    {
      key: "certificate",
      render: item => {
        if (!item?.pool_id) {
          return <p className='text-right'>-</p>;
        }
        return (
          <div className='flex justify-end'>
            <Link
              to='/pool/$id'
              search={{
                page: undefined,
                limit: undefined,
                offset: undefined,
                order: undefined,
                sort: undefined,
                tab: "about",
              }}
              params={{ id: item.pool_id }}
              className='text-primary'
            >
              <ExternalLink size={15} className='cursor-pointer text-primary' />
            </Link>
          </div>
        );
      },
      jsonFormat: item => {
        if (!item.pool_id) {
          return "-";
        }

        return item.pool_id;
      },
      title: <p className='w-full text-nowrap text-right'>Certificate</p>,
      visible: columnsVisibility.certificate,
      widthPx: 30,
    },
  ];

  useEffect(() => {
    if (totalPools && totalPools !== totalItems) {
      setTotalItems(totalPools);
    }
  }, [totalPools, totalItems]);

  return (
    <PageBase
      metadataTitle='poolUpdatesList'
      title='Pool Updates'
      breadcrumbItems={[{ label: "Pool Updates" }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
            {poolsListQuery.isLoading || poolsListQuery.isFetching ? (
              <LoadingSkeleton height='27px' width={"220px"} />
            ) : totalItems > 0 ? (
              <h3 className='basis-[230px] text-nowrap'>
                Total of {formatNumber(totalItems)} pools
              </h3>
            ) : (
              ""
            )}
            <div className='flex w-full justify-end md:hidden'>
              <div className='flex items-center gap-1 md:hidden'>
                <ExportButton columns={columns} items={items} />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  columnsOptions={poolUpdatesTableOptions.map(item => {
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
              placeholder='Search your results...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full '
              showSearchIcon
              showPrefixPopup={false}
            />
            <div className='hidden items-center gap-1 md:flex'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={poolUpdatesTableOptions.map(item => {
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
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          itemsPerPage={rows}
          scrollable
          query={poolsListQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof PoolUpdatesColumns) -
              columnsOrder.indexOf(b.key as keyof PoolUpdatesColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
