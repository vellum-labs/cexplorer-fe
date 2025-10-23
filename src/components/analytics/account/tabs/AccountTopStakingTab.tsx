import type { AnalyticsTopStakingAccounts } from "@/types/analyticsTypes";
import type {
  AccountAnalyticsTopStakingTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import GlobalTable from "@/components/table/GlobalTable";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchAnalyticsStakingAccounts } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useAccountAnalyticsTableStore } from "@/stores/tables/accountAnalyticsTopStakingTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { accountAnalyticsTopStakingTableOptions } from "@/constants/tables/accountAnalyticsTopStakingTableOptions";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { calculateLoyaltyDays } from "@/utils/slotToDate";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { X } from "lucide-react";

export const AccountTopStakingTab: FC = () => {
  const { page, drep_only, pool_only } = useSearch({
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
  } = useAccountAnalyticsTableStore();

  const accountsQuery = useFetchAnalyticsStakingAccounts(
    (page ?? 1) * rows - rows,
    rows,
    drep_only,
    pool_only,
  );
  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);

  const totalAccounts = accountsQuery.data?.pages[0].data.count;
  const items = accountsQuery.data?.pages.flatMap(page => page.data.data);

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
    storeKey: "account_top_staking_tab",
    filterKeys: ["pool_only", "drep_only"],
    tabName: "top_staking_accounts",
  });

  const columns: TableColumns<AnalyticsTopStakingAccounts> = [
    {
      key: "order",
      render: () => {},
      title: "#",
      standByRanking: true,
      visible: columnsVisibility.order,
      widthPx: 30,
    },
    {
      key: "account",
      render: item => {
        if (!item.view) {
          return "-";
        }

        return (
          <Link
            to='/stake/$stakeAddr'
            params={{
              stakeAddr: item.view,
            }}
            className='text-primary'
          >
            {formatString(item.view, "long")}
          </Link>
        );
      },
      title: "Account",
      visible: columnsVisibility.account,
      widthPx: 30,
    },
    {
      key: "live_stake",
      render: item => {
        if (!item.live_stake) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.live_stake} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Live stake</p>,
      visible: columnsVisibility.live_stake,
      widthPx: 30,
    },
    {
      key: "loyalty",
      render: item => {
        if (!item.deleg?.delegation?.tx?.slot) {
          return <p>-</p>;
        }

        return (
          <p>
            {calculateLoyaltyDays(
              item.deleg?.delegation?.tx?.slot,
              miscConst?.epoch_stat?.pots?.slot_no ?? 0,
            )}
            d
          </p>
        );
      },
      title: <p>Loyalty</p>,
      visible: columnsVisibility.loyalty,
      widthPx: 30,
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
            poolImageUrl={generateImageUrl(item.deleg?.id, "ico", "pool")}
          />
        );
      },
      title: (
        <div className='flex items-center gap-1' ref={anchorRefs?.pool_only}>
          Pool delegation
        </div>
      ),
      filter: {
        anchorRef: anchorRefs?.pool_only,
        activeFunnel: !!filter["pool_only"],
        filterOpen: filterVisibility.pool_only,
        filterButtonDisabled: filter.pool_only
          ? filter.pool_only === filterDraft["pool_only"]
          : false,
        onShow: e => toggleFilter(e, "pool_only"),
        onFilter: () =>
          changeFilterByKey("pool_only", +filterDraft["pool_only"]),
        onReset: () => changeFilterByKey("pool_only"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='status'
                value='1'
                className='accent-primary'
                checked={filterDraft["pool_only"] === +"1"}
                onChange={e =>
                  changeDraftFilter("pool_only", +e.currentTarget.value)
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
                checked={filterDraft["pool_only"] === +"2"}
                onChange={e =>
                  changeDraftFilter("pool_only", +e.currentTarget.value)
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
        <div className='flex items-center gap-1' ref={anchorRefs?.drep_only}>
          DRep delegation
        </div>
      ),
      filter: {
        anchorRef: anchorRefs?.drep_only,
        activeFunnel: !!filter["drep_only"],
        filterOpen: filterVisibility.drep_only,
        filterButtonDisabled: filter.drep_only
          ? filter.drep_only === filterDraft["drep_only"]
          : false,
        onShow: e => toggleFilter(e, "drep_only"),
        onFilter: () =>
          changeFilterByKey("drep_only", +filterDraft["drep_only"]),
        onReset: () => changeFilterByKey("drep_only"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='status'
                value='1'
                className='accent-primary'
                checked={filterDraft["drep_only"] === +"1"}
                onChange={e =>
                  changeDraftFilter("drep_only", +e.currentTarget.value)
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
                checked={filterDraft["drep_only"] === +"2"}
                onChange={e =>
                  changeDraftFilter("drep_only", +e.currentTarget.value)
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
  ];

  useEffect(() => {
    if (totalAccounts !== undefined && totalAccounts !== totalItems) {
      setTotalItems(totalAccounts);
    }
  }, [totalAccounts, totalItems]);

  return (
    <div className='mb-2'>
      <div className='mb-2 flex w-full items-center justify-between'>
        <div>
          {accountsQuery.isLoading || accountsQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : totalItems > 0 ? (
            <h3 className='basis-[230px] text-wrap'>
              Total of {formatNumber(totalItems)} accounts
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
            columnsOptions={accountAnalyticsTopStakingTableOptions.map(item => {
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
      {hasFilter && (
        <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  {key === "pool_only" && <span>Pool delegation:</span>}
                  <span>
                    {key === "pool_only" &&
                      (+value === 1
                        ? "Delegated to a stake pool"
                        : "Not delegated to a stake pool")}
                  </span>
                  {key === "drep_only" && <span>DRep delegation:</span>}
                  <span>
                    {key === "drep_only" &&
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
        query={accountsQuery}
        items={items}
        minContentWidth={1000}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof AccountAnalyticsTopStakingTableColumns,
            ) -
            columnsOrder.indexOf(
              b.key as keyof AccountAnalyticsTopStakingTableColumns,
            )
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
