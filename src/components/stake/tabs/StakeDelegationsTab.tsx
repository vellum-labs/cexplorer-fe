import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { Badge } from "@/components/global/badges/Badge";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import DateCell from "@/components/table/DateCell";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import PoolCell from "@/components/table/PoolCell";
import { accountDelegationsTableOptions } from "@/constants/tables/accountDelegationsTableOptions";
import {
  useFetchDelegations,
  useFetchDelegationsState,
} from "@/services/delegations";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";
import type {
  DelegationData,
  DelegationStateData,
} from "@/types/delegationTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { PoolDelegatorsColumns, TableColumns } from "@/types/tableTypes";
import { formatString } from "@/utils/format/format";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import { Link, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  address: string;
  miscConst: MiscConstResponseData | undefined;
}

const StakeDelegationsTab = ({ address, miscConst }: Props) => {
  const [totalItems, setTotalItems] = useState(0);
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/stake/$stakeAddr" });
  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    rows,
    setRows,
    setColumnVisibility,
  } = usePoolDelegatorsTableStore();

  const delegationStateQuery = useFetchDelegationsState(address);
  const delegationQuery = useFetchDelegations(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    address,
  );
  const items = delegationQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = delegationQuery.data?.pages[0].data.count;

  const delegationStateColumns: TableColumns<DelegationStateData> = [
    {
      key: "date",
      render: item => {
        return (
          <Link
            to='/stake/$stakeAddr'
            params={{ stakeAddr: item.view }}
            className='text-primary'
          >
            {formatString(item.view, "longer")}
          </Link>
        );
      },
      title: <p>Address</p>,
      visible: columnsVisibility.date,
      widthPx: 80,
    },
    {
      key: "active_in",
      render: item => (
        <div className='flex flex-col items-end gap-1'>
          {item?.delegation.active.active_epoch_no ?? "-"}
        </div>
      ),
      title: <p className='w-full text-right'>Active epoch</p>,
      visible: columnsVisibility.active_in,
      widthPx: 50,
    },
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1'>
          {item.delegation?.live?.pool?.id ? (
            <PoolCell poolInfo={item.delegation.live.pool} />
          ) : (
            <Badge color='yellow'>Not delegated</Badge>
          )}
        </div>
      ),
      title: "Stake Pool",
      visible: columnsVisibility.address,
      widthPx: 110,
    },
    {
      key: "amount",
      render: item => (
        <div className='flex flex-col items-end gap-1'>
          <AdaWithTooltip data={item?.stake?.active[0]?.amount ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <span>Active Stake</span>
        </div>
      ),
      visible: columnsVisibility.amount,
      widthPx: 60,
    },
    {
      key: "loyalty",
      render: item => (
        <p className='text-right'>
          {calculateLoyaltyDays(
            item.delegation.active.slot_no,
            miscConst?.epoch_stat?.pots?.slot_no ?? 0,
          )}
          d
        </p>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <div className='flex w-fit cursor-pointer items-center gap-1 text-right'>
            <span>Loyalty</span>
          </div>
        </div>
      ),
      visible: columnsVisibility.loyalty,
      widthPx: 80,
    },
    {
      key: "registered",
      render: item => {
        return (
          <DateCell
            className=''
            time={format(
              slotToDate(
                item.delegation.active.slot_no,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      title: <p className=''>Registered</p>,
      visible: columnsVisibility.registered,
      widthPx: 80,
    },
  ];

  const delegationColumns: TableColumns<DelegationData> = [
    {
      key: "date",
      render: item => {
        return (
          <DateCell
            time={format(
              slotToDate(
                item.tx.slot_no,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      jsonFormat: item => {
        if (
          !format(
            slotToDate(
              item.tx.slot_no,
              miscConst?.epoch_stat.pots.slot_no ?? 0,
              miscConst?.epoch_stat.epoch.start_time ?? "",
            ),
            "yyy-MM-dd HH:mm:ss",
          )
        ) {
          return "-";
        }

        return format(
          slotToDate(
            item.tx.slot_no,
            miscConst?.epoch_stat.pots.slot_no ?? 0,
            miscConst?.epoch_stat.epoch.start_time ?? "",
          ),
          "yyy-MM-dd HH:mm:ss",
        );
      },
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 80,
    },
    {
      key: "active_in",
      render: item => (
        <div className='flex flex-col items-end gap-1'>
          {item?.active_epoch_no}
        </div>
      ),
      title: <p className='w-full text-right'>Active epoch</p>,
      visible: columnsVisibility.active_in,
      widthPx: 50,
    },
    {
      key: "address",
      render: item => (
        <div className='flex items-center gap-1'>
          <PoolCell poolInfo={item.pool.live} />
        </div>
      ),
      jsonFormat: item => {
        if (!item.pool.live.id) {
          return "-";
        }

        const id = item.pool.live.id;
        const ticker = item.pool.live.meta?.ticker;
        const name = item.pool.live.meta?.name;

        return ticker && name ? `[${ticker}] ${name}` : id;
      },
      title: "Stake Pool",
      visible: columnsVisibility.address,
      widthPx: 110,
    },
    {
      key: "amount",
      render: item => (
        <div className='flex flex-col items-end gap-1'>
          <AdaWithTooltip data={item?.active_stake ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <span>Active Stake</span>
        </div>
      ),
      visible: columnsVisibility.amount,
      widthPx: 60,
    },
    {
      key: "loyalty",
      render: item => {
        const loyalty = calculateLoyaltyDays(
          item.tx?.slot_no,
          miscConst?.epoch_stat?.pots?.slot_no ?? 0,
        );

        return <p className='text-right'>{loyalty < 0 ? 0 : loyalty}d</p>;
      },
      title: (
        <div className='flex w-full justify-end'>
          <div className='flex w-fit cursor-pointer items-center gap-1 text-right'>
            <span>Loyalty</span>
          </div>
        </div>
      ),
      visible: columnsVisibility.loyalty,
      widthPx: 80,
    },
    {
      key: "registered",
      render: item => {
        return (
          <DateCell
            className='text-right'
            time={format(
              slotToDate(
                item.tx?.slot_no,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      jsonFormat: item => {
        if (
          !format(
            slotToDate(
              item.tx?.slot_no,
              miscConst?.epoch_stat.pots.slot_no ?? 0,
              miscConst?.epoch_stat.epoch.start_time ?? "",
            ),
            "yyy-MM-dd HH:mm:ss",
          )
        ) {
          return "-";
        }

        return format(
          slotToDate(
            item.tx?.slot_no,
            miscConst?.epoch_stat.pots.slot_no ?? 0,
            miscConst?.epoch_stat.epoch.start_time ?? "",
          ),
          "yyy-MM-dd HH:mm:ss",
        );
      },
      title: <p className='w-full text-right'>Registered</p>,
      visible: columnsVisibility.registered,
      widthPx: 80,
    },
  ];

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <section className='flex flex-col-reverse gap-8'>
      {delegationStateQuery.data?.count &&
        delegationStateQuery.data?.count > 1 && (
          <div>
            <h3 className='mb-4 flex items-center gap-2'>Multi delegations</h3>
            <GlobalTable
              type='default'
              itemsPerPage={10}
              rowHeight={60}
              scrollable
              query={delegationStateQuery}
              items={delegationStateQuery.data?.data}
              columns={delegationStateColumns.sort((a, b) => {
                return (
                  columnsOrder.indexOf(a.key as keyof PoolDelegatorsColumns) -
                  columnsOrder.indexOf(b.key as keyof PoolDelegatorsColumns)
                );
              })}
              onOrderChange={setColumsOrder}
            />
          </div>
        )}
      <div className='flex flex-col'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='my-4'>Delegation history</h3>
          <div className='flex items-center gap-2'>
            <ExportButton columns={delegationColumns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={accountDelegationsTableOptions.map(item => {
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
          rowHeight={69}
          scrollable
          query={delegationQuery}
          items={items}
          columns={delegationColumns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof PoolDelegatorsColumns) -
              columnsOrder.indexOf(b.key as keyof PoolDelegatorsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
    </section>
  );
};

export default StakeDelegationsTab;
