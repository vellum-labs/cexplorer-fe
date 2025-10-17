import type { AnalyticsTopAddresses } from "@/types/analyticsTypes";
import type {
  AccountAnalyticsTopAddressesTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import DateCell from "@/components/table/DateCell";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";
import PoolCell from "@/components/table/PoolCell";

import { useFetchAnalyticsTopAddresses } from "@/services/analytics";
import { useAccountTopAddressesTableStore } from "@/stores/tables/accountAnalyticsTopAddressesTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { accountAnalyticsTopAddressesTableOptions } from "@/constants/tables/accountAnalyticsTopAddressesTab";
import { formatNumber, formatString } from "@/utils/format/format";
import { X } from "lucide-react";
import { useFilterTable } from "@/hooks/tables/useFilterTable";

export const AccounntTopAddressesTab: FC = () => {
  const { page, addresses_drep_only, addresses_pool_only } = useSearch({
    from: "/analytics/account",
  });

  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useAccountTopAddressesTableStore();

  const addressesQuery = useFetchAnalyticsTopAddresses(
    (page ?? 1) * rows - rows,
    rows,
    addresses_drep_only,
    addresses_pool_only,
  );

  const {
    anchorRefs,
    filter,
    filterDraft,
    filterVisibility,
    hasFilter,
    changeDraftFilter,
    changeFilterByKey,
    toggleFilter,
  } = useFilterTable({
    storeKey: "account_top_addresses_tab",
    filterKeys: ["addresses_pool_only", "addresses_drep_only"],
    tabName: "top_addresses",
  });

  const totalAddresses = addressesQuery.data?.pages[0].data.count;
  const items = addressesQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<AnalyticsTopAddresses> = [
    {
      key: "order",
      render: () => {},
      title: "#",
      standByRanking: true,
      visible: columnsVisibility.order,
      widthPx: 15,
    },
    {
      key: "account",
      render: item => {
        if (!item.address) {
          return "-";
        }

        return (
          <Link
            to='/address/$address'
            params={{
              address: item.address,
            }}
            className='text-primary'
          >
            {formatString(item.address, "long")}
          </Link>
        );
      },
      title: "Account",
      visible: columnsVisibility.account,
      widthPx: 40,
    },
    {
      key: "ada_balance",
      render: item => {
        if (!item.balance) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.balance} />
          </p>
        );
      },
      title: <p className='w-full text-right'>ADA Balance</p>,
      visible: columnsVisibility.ada_balance,
      widthPx: 40,
    },
    {
      key: "pool_delegation",
      render: item => {
        if (!item.deleg?.id && !item.deleg?.meta) {
          return <p>-</p>;
        }

        return (
          <PoolCell
            poolInfo={{
              id: item.deleg?.id,
              meta: item.deleg?.meta,
            }}
          />
        );
      },
      title: (
        <p
          className='flex items-center gap-1'
          ref={anchorRefs?.addresses_pool_only}
        >
          Pool delegation
        </p>
      ),
      filter: {
        anchorRef: anchorRefs?.addresses_pool_only,
        activeFunnel: !!filter["addresses_pool_only"],
        filterOpen: filterVisibility.addresses_pool_only,
        filterButtonDisabled: filter.addresses_pool_only
          ? filter.addresses_pool_only === filterDraft["addresses_pool_only"]
          : false,
        onShow: e => toggleFilter(e, "addresses_pool_only"),
        onFilter: () =>
          changeFilterByKey(
            "addresses_pool_only",
            +filterDraft["addresses_pool_only"],
          ),
        onReset: () => changeFilterByKey("addresses_pool_only"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='status'
                value='1'
                className='accent-primary'
                checked={filterDraft["addresses_pool_only"] === +"1"}
                onChange={e =>
                  changeDraftFilter(
                    "addresses_pool_only",
                    +e.currentTarget.value,
                  )
                }
              />
              <span className='text-text-sm'>Delegated to a stake pool</span>
            </label>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='status'
                value='2'
                className='accent-primary'
                checked={filterDraft["addresses_pool_only"] === +"2"}
                onChange={e =>
                  changeDraftFilter(
                    "addresses_pool_only",
                    +e.currentTarget.value,
                  )
                }
              />
              <span className='text-text-sm'>
                Not delegated to a stake pool
              </span>
            </label>
          </div>
        ),
      },
      visible: columnsVisibility.pool_delegation,
      widthPx: 60,
    },
    {
      key: "drep_delegation",
      render: item => {
        if (!item.drep?.id) {
          return <p>-</p>;
        }

        return (
          <DrepNameCell
            item={{
              data: item.drep?.meta
                ? {
                    given_name: item.drep.meta.given_name,
                  }
                : undefined,
              hash: { view: item.drep?.id },
            }}
          />
        );
      },
      title: (
        <div
          className='flex items-center gap-1'
          ref={anchorRefs?.addresses_drep_only}
        >
          DRep delegation
        </div>
      ),
      filter: {
        anchorRef: anchorRefs?.addresses_drep_only,
        activeFunnel: !!filter["addresses_drep_only"],
        filterOpen: filterVisibility.addresses_drep_only,
        filterButtonDisabled: filter.addresses_drep_only
          ? filter.addresses_drep_only === filterDraft["addresses_drep_only"]
          : false,
        onShow: e => toggleFilter(e, "addresses_drep_only"),
        onFilter: () =>
          changeFilterByKey(
            "addresses_drep_only",
            +filterDraft["addresses_drep_only"],
          ),
        onReset: () => changeFilterByKey("addresses_drep_only"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='status'
                value='1'
                className='accent-primary'
                checked={filterDraft["addresses_drep_only"] === +"1"}
                onChange={e =>
                  changeDraftFilter(
                    "addresses_drep_only",
                    +e.currentTarget.value,
                  )
                }
              />
              <span className='text-text-sm'>Delegated to a DRep</span>
            </label>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='status'
                value='2'
                className='accent-primary'
                checked={filterDraft["addresses_drep_only"] === +"2"}
                onChange={e =>
                  changeDraftFilter(
                    "addresses_drep_only",
                    +e.currentTarget.value,
                  )
                }
              />
              <span className='text-text-sm'>Not delegated to a DRep</span>
            </label>
          </div>
        ),
      },
      visible: columnsVisibility.drep_delegation,
      widthPx: 60,
    },
    {
      key: "first_activity",
      render: item => {
        if (!item.first) {
          return <p>-</p>;
        }

        return <DateCell time={item.first} />;
      },
      title: <p>First activity</p>,
      visible: columnsVisibility.first_activity,
      widthPx: 40,
    },
    {
      key: "last_activity",
      render: item => {
        if (!item.last) {
          return <p>-</p>;
        }

        return <DateCell time={item.last} />;
      },
      title: <p>Last activity</p>,
      visible: columnsVisibility.last_activity,
      widthPx: 40,
    },
  ];

  useEffect(() => {
    if (totalAddresses !== undefined && totalAddresses !== totalItems) {
      setTotalItems(totalAddresses);
    }
  }, [totalAddresses, totalItems]);

  return (
    <div className='mb-2'>
      <div className='mb-2 flex w-full items-center justify-between'>
        <div>
          {addressesQuery.isLoading || addressesQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : totalItems > 0 ? (
            <h3 className='basis-[230px] text-wrap'>
              Total of {formatNumber(totalItems)} addresses
            </h3>
          ) : (
            ""
          )}
        </div>
        <div className='flex items-center gap-1'>
          <ExportButton
            columns={columns}
            items={items}
            currentPage={page ?? 1}
          />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={accountAnalyticsTopAddressesTableOptions.map(
              item => {
                return {
                  label: item.name,
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              },
            )}
          />
        </div>
      </div>
      {hasFilter && (
        <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  {key === "addresses_pool_only" && (
                    <span>Pool delegation:</span>
                  )}
                  <span>
                    {key === "addresses_pool_only" &&
                      (+value === 1
                        ? "Delegated to a stake pool"
                        : "Not delegated to a stake pool")}
                  </span>
                  {key === "addresses_drep_only" && (
                    <span>DRep delegation:</span>
                  )}
                  <span>
                    {key === "addresses_drep_only" &&
                      (+value === 1
                        ? "Delegated to a DRep"
                        : "Not delegated to a DRep")}
                  </span>
                  <X
                    size={13}
                    className='cursor-pointer'
                    onClick={() => changeFilterByKey(key)}
                  />
                </div>
              ),
          )}
        </div>
      )}
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={addressesQuery}
        items={items}
        minContentWidth={1000}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof AccountAnalyticsTopAddressesTableColumns,
            ) -
            columnsOrder.indexOf(
              b.key as keyof AccountAnalyticsTopAddressesTableColumns,
            )
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
