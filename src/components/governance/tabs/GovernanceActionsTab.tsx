import type { GovernanceActionList } from "@/types/governanceTypes";
import type {
  GovernanceListTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";

import { ExternalLink, X } from "lucide-react";

import { useGovernanceListTableStore } from "@/stores/tables/governanceListTableStore";
import { useEffect, useState } from "react";
import { useFetchGovernanceAction } from "@/services/governance";
import { useFilterTable } from "@/hooks/tables/useFilterTable";

import { governanceListTableOptions } from "@/constants/tables/governanceActionsListTableOptions";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { getEpochByTime } from "@/utils/getEpochByTime";
import { GovernanceStatusBadge } from "@vellumlabs/cexplorer-sdk";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { GovernanceVotingProgress } from "@/components/governance/GovernanceVotingProgress";
import type { MiscConstResponseData } from "@/types/miscTypes";

const typeLabels: Record<string, string> = {
  NewCommittee: "New Committee",
  NewConstitution: "New Constitution",
  HardForkInitiation: "Hardfork Initiation",
  ParameterChange: "Parameter change",
  TreasuryWithdrawals: "Treasury Withdrawals",
  InfoAction: "Info action",
};

interface GovernanceActionsTabProps {
  miscConst: MiscConstResponseData | undefined;
  outcomesOnly?: boolean;
}

export const GovernanceActionsTab: FC<GovernanceActionsTabProps> = ({
  miscConst,
  outcomesOnly = false,
}) => {
  const { page, state } = useSearch({
    from: "/gov/action/",
  });

  const navigate = useNavigate();

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useGovernanceListTableStore();

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable({
      debounceFilter: tableSearch =>
        tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    });

  const [selectedItem, setSelectedItem] = useState<
    "All" | "Active" | "Ratified" | "Expired" | "Enacted" | "Approved"
  >(
    outcomesOnly
      ? "Approved"
      : (state as "All" | "Active" | "Ratified" | "Expired" | "Enacted") ||
          "All",
  );

  const {
    filterVisibility,
    filter,
    hasFilter,
    anchorRefs,
    filterDraft,
    changeDraftFilter,
    changeFilterByKey,
    toggleFilter,
  } = useFilterTable({
    storeKey: "governance_list_filter",
    filterKeys: ["type"],
  });

  const queryState = outcomesOnly ? selectedItem : state || "All";

  const govActionQuery = useFetchGovernanceAction(
    rows,
    (page ?? 1) * rows - rows,
    queryState,
    debouncedTableSearch ? debouncedTableSearch : undefined,
    filter.type,
  );

  const totalItems = govActionQuery.data?.pages[0].data.count;
  const items = govActionQuery.data?.pages.flatMap(page => page.data.data);

  const selectItems = outcomesOnly
    ? [
        {
          key: "Approved",
          value: "Approved",
        },
        {
          key: "Enacted",
          value: "Enacted",
        },
        {
          key: "Ratified",
          value: "Ratified",
        },
      ]
    : [
        {
          key: "All",
          value: "All",
        },
        {
          key: "Active",
          value: "Active",
        },
        {
          key: "Enacted",
          value: "Enacted",
        },
        {
          key: "Ratified",
          value: "Ratified",
        },
        {
          key: "Expired",
          value: "Expired / Dropped",
        },
      ];

  useEffect(() => {
    if (outcomesOnly) return;
    if (state && state !== selectedItem) {
      setSelectedItem(
        state as
          | "All"
          | "Active"
          | "Ratified"
          | "Expired"
          | "Enacted"
          | "Approved",
      );
    }
  }, [state, outcomesOnly]);

  useEffect(() => {
    if (outcomesOnly) return;

    if (state !== selectedItem && selectedItem !== "All") {
      navigate({
        search: {
          page: 1,
          state: selectedItem,
        } as any,
      });
    } else if (selectedItem === "All" && state) {
      navigate({
        search: {
          page: 1,
          state: undefined,
        } as any,
      });
    }
  }, [selectedItem, outcomesOnly]);

  const columns: TableColumns<GovernanceActionList> = [
    {
      key: "start",
      render: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        const epoch = getEpochByTime(
          new Date(item.tx.time).getTime(),
          new Date(miscConst?.epoch.start_time ?? "").getTime() / 1000,
          miscConst?.epoch.no ?? 0,
        );

        return (
          <div className='flex flex-col gap-1/2'>
            <DateCell time={item?.tx?.time} />
            {epoch && (
              <div className='flex items-center gap-1/2'>
                <span className='text-text-xs text-grayTextPrimary'>
                  Epoch -{" "}
                </span>
                <div className='text-text-xs'>
                  <EpochCell no={epoch} justify='start' />
                </div>
              </div>
            )}
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        return item.tx.time;
      },
      title: "Start",
      visible: columnsVisibility.start,
      widthPx: 60,
    },
    {
      key: "type",
      render: item => {
        if (!item?.type) {
          return "-";
        }

        return <ActionTypes title={item?.type as ActionTypes} />;
      },
      title: <p ref={anchorRefs?.type}>Type</p>,
      filter: {
        anchorRef: anchorRefs?.type,
        width: "200px",
        activeFunnel: !!filter.type,
        filterOpen: filterVisibility.type,
        filterButtonDisabled: filter.type
          ? filter.type === filterDraft["type"]
          : false,
        onShow: e => toggleFilter(e, "type"),
        onFilter: () => changeFilterByKey("type", filterDraft["type"]),
        onReset: () => changeFilterByKey("type"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {[
              { value: "NewCommittee", label: "New Committee" },
              { value: "NewConstitution", label: "New Constitution" },
              { value: "HardForkInitiation", label: "Hardfork Initiation" },
              { value: "ParameterChange", label: "Parameter change" },
              { value: "TreasuryWithdrawals", label: "Treasury Withdrawals" },
              { value: "InfoAction", label: "Info action" },
            ].map(({ value, label }) => (
              <label className='flex items-center gap-1' key={value}>
                <input
                  type='radio'
                  name='type'
                  value={value}
                  className='accent-primary'
                  checked={filterDraft["type"] === value}
                  onChange={e =>
                    changeDraftFilter("type", e.currentTarget.value)
                  }
                />
                <span className='text-text-sm'>{label}</span>
              </label>
            ))}
          </div>
        ),
      },
      visible: columnsVisibility.type,
      widthPx: 90,
    },
    {
      key: "gov_action_name",
      render: item => {
        if (!item?.ident?.id) {
          return "-";
        }

        return (
          <div className='flex flex-col'>
            {
              <Link
                to='/gov/action/$id'
                params={{
                  id: item?.ident?.id?.replace(/#/g, "%23"),
                }}
                className={"text-primary"}
              >
                {item?.anchor?.offchain?.name ?? "⚠️ Invalid metadata"}
              </Link>
            }
            <div className='flex items-center gap-1'>
              <Link
                to='/gov/action/$id'
                params={{
                  id: item?.ident?.id?.replace(/#/g, "%23"),
                }}
                className={"text-text-xs"}
                disabled={true}
              >
                {formatString(item?.ident?.bech, "long")}
              </Link>
              <Copy copyText={item?.ident?.bech} size={10} />
            </div>
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.ident?.bech) {
          return "-";
        }

        return item?.ident?.bech;
      },
      title: "Name",
      visible: columnsVisibility.gov_action_name,
      widthPx: 220,
    },
    {
      key: "duration",
      render: item => {
        if (!item?.expired_epoch || !item?.tx?.time) {
          return <p className='text-right'>-</p>;
        }

        const epoch = getEpochByTime(
          new Date(item.tx.time).getTime(),
          new Date(miscConst?.epoch.start_time ?? "").getTime() / 1000,
          miscConst?.epoch.no ?? 0,
        );

        return <p className='text-right'>{item?.expired_epoch - epoch}</p>;
      },
      title: <p className='w-full text-right'>Duration (epochs)</p>,
      visible: columnsVisibility.duration,
      widthPx: 50,
    },
    {
      key: "end",
      render: item => {
        if (!item?.expired_epoch || !miscConst?.epoch.start_time) {
          return "-";
        }

        const { endTime } = calculateEpochTimeByNumber(
          +item?.expired_epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time,
        );

        return (
          <div className='flex flex-col gap-1/2'>
            <DateCell time={String(endTime)} withoutConvert />
            {item?.expired_epoch && (
              <div className='flex items-center gap-1/2'>
                <span className='text-text-xs text-grayTextPrimary'>
                  Epoch -{" "}
                </span>
                <div className='text-text-xs'>
                  <EpochCell no={item?.expired_epoch} justify='start' />
                </div>
              </div>
            )}
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.expired_epoch) {
          return "-";
        }

        return item.expired_epoch;
      },
      title: "Expiry epoch",
      visible: columnsVisibility.end,
      widthPx: 60,
    },
    {
      key: "status",
      render: item => (
        <GovernanceStatusBadge item={item} currentEpoch={miscConst?.no ?? 0} />
      ),
      title: "Status",
      visible: columnsVisibility.status,
      widthPx: 55,
    },
    {
      key: "progress",
      render: item => {
        return <GovernanceVotingProgress governanceAction={item as any} />;
      },
      title: "Progress",
      visible: columnsVisibility.progress,
      widthPx: 75,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return (
          <Link
            to='/tx/$hash'
            params={{
              hash: item.tx.hash,
            }}
            className='flex items-center justify-end text-primary'
          >
            <ExternalLink size={18} />
          </Link>
        );
      },
      title: <p className='w-full text-right'>Tx</p>,
      visible: columnsVisibility.tx,
      widthPx: 40,
    },
  ];

  return (
    <>
      <div className='my-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap md:hidden'>
          <div className='flex w-full justify-between gap-1/2 md:hidden'>
            <SortBy
              selectItems={selectItems}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem as any}
              labelName='Status: '
            />
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={governanceListTableOptions.map(item => {
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

        <SortBy
          selectItems={selectItems}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem as any}
          className='hidden w-fit md:flex'
          labelName='Status: '
        />
        <div className='flex gap-1'>
          <TableSearchInput
            placeholder='Search  your results...'
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
              columnsOptions={governanceListTableOptions.map(item => {
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
      {hasFilter && (
        <div className='mb-2 flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  <span>{key[0].toUpperCase() + key.slice(1)}:</span>
                  <span>
                    {key === "type" ? typeLabels[value] || value : value}
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
        rowHeight={67}
        minContentWidth={1100}
        scrollable
        query={govActionQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof GovernanceListTableColumns) -
            columnsOrder.indexOf(b.key as keyof GovernanceListTableColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
