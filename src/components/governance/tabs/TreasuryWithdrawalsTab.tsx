import type { GovernanceActionList } from "@/types/governanceTypes";
import type {
  TreasuryWithdrawalsTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";
import type { MiscConstResponseData } from "@/types/miscTypes";

import { Link, useSearch } from "@tanstack/react-router";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { formatAbbreviatedADA, formatFullADA } from "@/utils/formatADA";

import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

import { useTreasuryWithdrawalsTableStore } from "@/stores/tables/treasuryWithdrawalsTableStore";
import { useState, useMemo, useCallback } from "react";
import { useFetchGovernanceAction } from "@/services/governance";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

import { treasuryWithdrawalsTableOptions } from "@/constants/tables/treasuryWithdrawalsTableOptions";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { getEpochByTime } from "@/utils/getEpochByTime";
import { GovernanceStatusBadge } from "@vellumlabs/cexplorer-sdk";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { GovernanceVotingProgress } from "@/components/governance/GovernanceVotingProgress";
import { NCLProgressBar } from "@/components/governance/treasury/NCLProgressBar";
import { NCL_PERIODS } from "@/constants/ncl";

type StatusFilter = "Approved" | "Enacted" | "Ratified";

interface TreasuryWithdrawalsTabProps {
  miscConst: MiscConstResponseData | undefined;
}

const getWithdrawalAmount = (item: GovernanceActionList): number => {
  if (item.type !== "TreasuryWithdrawals") return 0;

  const contents = item.description?.contents;
  if (!Array.isArray(contents)) return 0;

  let total = 0;
  for (const content of contents) {
    if (Array.isArray(content)) {
      for (const innerItem of content) {
        if (Array.isArray(innerItem) && innerItem.length >= 2) {
          const amount = innerItem[innerItem.length - 1];
          if (typeof amount === "number") {
            total += amount;
          }
        }
      }
    } else if (typeof content === "object" && content !== null) {
      if ("amount" in content && typeof content.amount === "number") {
        total += content.amount;
      }
    }
  }

  return total;
};

export const TreasuryWithdrawalsTab: FC<TreasuryWithdrawalsTabProps> = ({
  miscConst,
}) => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { page } = useSearch({
    from: "/gov/action/",
  });

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumnsOrder,
    setRows,
  } = useTreasuryWithdrawalsTableStore();

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable({
      debounceFilter: tableSearch =>
        tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    });

  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>("Approved");
  const [showNCLProgress, setShowNCLProgress] = useState(true);
  const [selectedNCLPeriodId, setSelectedNCLPeriodId] = useState<string>(
    NCL_PERIODS[0]?.id || "",
  );

  const selectedNCLPeriod = useMemo(() => {
    return (
      NCL_PERIODS.find(p => p.id === selectedNCLPeriodId) || NCL_PERIODS[0]
    );
  }, [selectedNCLPeriodId]);

  const graphQuery = useFetchGovernanceAction(
    100,
    0,
    selectedStatus,
    undefined,
    "TreasuryWithdrawals",
  );

  const govActionQuery = useFetchGovernanceAction(
    rows,
    (page ?? 1) * rows - rows,
    selectedStatus,
    debouncedTableSearch ? debouncedTableSearch : undefined,
    "TreasuryWithdrawals",
  );

  const graphItems = graphQuery.data?.pages.flatMap(page => page.data.data);
  const tableItems = govActionQuery.data?.pages.flatMap(page => page.data.data);

  const getItemEpoch = useCallback(
    (item: GovernanceActionList): number | null => {
      // For enacted items, use enacted_epoch
      if (item?.enacted_epoch !== undefined && item?.enacted_epoch !== null) {
        return item.enacted_epoch;
      }
      // For non-enacted items (Approved/Ratified), calculate epoch from tx time
      if (item?.tx?.time && miscConst?.epoch) {
        return getEpochByTime(
          new Date(item.tx.time).getTime(),
          new Date(miscConst.epoch.start_time ?? "").getTime() / 1000,
          miscConst.epoch.no ?? 0,
        );
      }
      return null;
    },
    [miscConst],
  );

  const filteredGraphItems = useMemo(() => {
    if (!graphItems || !selectedNCLPeriod) return graphItems;

    return graphItems.filter(item => {
      const epoch = getItemEpoch(item);
      if (epoch === null) return false;

      return (
        epoch >= selectedNCLPeriod.startEpoch &&
        epoch <= selectedNCLPeriod.endEpoch
      );
    });
  }, [graphItems, selectedNCLPeriod, getItemEpoch]);

  const filteredTableItems = useMemo(() => {
    if (!tableItems || !selectedNCLPeriod) return tableItems;

    return tableItems.filter(item => {
      const epoch = getItemEpoch(item);
      if (epoch === null) return false;

      return (
        epoch >= selectedNCLPeriod.startEpoch &&
        epoch <= selectedNCLPeriod.endEpoch
      );
    });
  }, [tableItems, selectedNCLPeriod, getItemEpoch]);

  const statusSelectItems = [
    {
      key: "Approved",
      value: t("common:governance.actions.statusApproved"),
    },
    {
      key: "Enacted",
      value: t("common:governance.actions.statusEnacted"),
    },
    {
      key: "Ratified",
      value: t("common:governance.actions.statusRatified"),
    },
  ];

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
            <DateCell time={item?.tx?.time} withoutConvert />
            {epoch && (
              <div className='flex items-center gap-1/2'>
                <span className='text-text-xs text-grayTextPrimary'>
                  {t("common:governance.actions.epochDash")}{" "}
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
      title: t("common:governance.actions.start"),
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
      title: t("common:governance.actions.type"),
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
                  id: encodeURIComponent(item?.ident?.id ?? ""),
                }}
                className={"text-primary"}
              >
                {item?.anchor?.offchain?.name ?? "Invalid metadata"}
              </Link>
            }
            <div className='flex items-center gap-1'>
              <Link
                to='/gov/action/$id'
                params={{
                  id: encodeURIComponent(item?.ident?.id ?? ""),
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
      title: t("common:governance.actions.name"),
      visible: columnsVisibility.gov_action_name,
      widthPx: 220,
    },
    {
      key: "amount",
      render: item => {
        const amount = getWithdrawalAmount(item);
        if (amount === 0) {
          return <p className='text-right'>-</p>;
        }

        return (
          <Tooltip content={formatFullADA(amount)}>
            <p className='text-right font-medium'>
              {formatAbbreviatedADA(amount)}
            </p>
          </Tooltip>
        );
      },
      jsonFormat: item => {
        const amount = getWithdrawalAmount(item);
        return amount > 0 ? formatFullADA(amount) : "-";
      },
      title: (
        <p className='w-full text-right'>
          {t("common:governance.treasury.amount")}
        </p>
      ),
      visible: columnsVisibility.amount,
      widthPx: 80,
    },
    {
      key: "status",
      render: item => (
        <GovernanceStatusBadge
          item={item}
          currentEpoch={miscConst?.no ?? 0}
          labels={{
            Active: t("common:governance.status.active"),
            Ratified: t("common:governance.status.ratified"),
            Enacted: t("common:governance.status.enacted"),
            Expired: t("common:governance.status.expired"),
            Dropped: t("common:governance.status.dropped"),
          }}
        />
      ),
      title: t("common:governance.actions.status"),
      visible: columnsVisibility.status,
      widthPx: 55,
    },
    {
      key: "progress",
      render: item => {
        return <GovernanceVotingProgress governanceAction={item as any} />;
      },
      title: t("common:governance.actions.progress"),
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
      title: (
        <p className='w-full text-right'>{t("common:governance.actions.tx")}</p>
      ),
      visible: columnsVisibility.tx,
      widthPx: 40,
    },
  ];

  return (
    <>
      <div className='mb-4'>
        <button
          onClick={() => setShowNCLProgress(!showNCLProgress)}
          className='text-sm mb-2 flex items-center gap-1 text-primary'
        >
          {showNCLProgress ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
          {showNCLProgress
            ? t("common:governance.treasury.hideNCL")
            : t("common:governance.treasury.showNCL")}
        </button>

        {showNCLProgress && selectedNCLPeriod && (
          <>
            {NCL_PERIODS.length > 1 && (
              <div className='mb-2'>
                <SortBy
                  selectItems={NCL_PERIODS.map(period => ({
                    key: period.id,
                    value: period.name,
                  }))}
                  selectedItem={selectedNCLPeriodId}
                  setSelectedItem={setSelectedNCLPeriodId as any}
                  label={false}
                  width='180px'
                />
              </div>
            )}

            <NCLProgressBar
              nclPeriod={selectedNCLPeriod}
              withdrawals={filteredGraphItems || []}
              getWithdrawalAmount={getWithdrawalAmount}
            />
          </>
        )}
      </div>

      <div className='my-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap md:hidden'>
          <div className='flex w-full justify-between gap-1/2 md:hidden'>
            <SortBy
              selectItems={statusSelectItems}
              selectedItem={selectedStatus}
              setSelectedItem={setSelectedStatus as any}
              labelName={t("common:governance.actions.statusLabel")}
            />
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton columns={columns} items={filteredTableItems} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                rowsLabel={t("common:table.rows")}
                columnsOptions={treasuryWithdrawalsTableOptions.map(item => {
                  return {
                    label: t(`common:tableSettings.${item.key}`),
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
          selectItems={statusSelectItems}
          selectedItem={selectedStatus}
          setSelectedItem={setSelectedStatus as any}
          className='hidden w-fit md:flex'
          labelName={t("common:governance.actions.statusLabel")}
        />
        <div className='flex gap-1'>
          <TableSearchInput
            placeholder={t("common:governance.voting.searchPlaceholder")}
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full '
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={filteredTableItems} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={treasuryWithdrawalsTableOptions.map(item => {
                return {
                  label: t(`common:tableSettings.${item.key}`),
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
      </div>

      <div className='text-sm mb-2 text-grayTextPrimary'>
        {t("common:governance.treasury.totalWithdrawals", {
          count: filteredGraphItems?.length || 0,
        })}
      </div>

      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={filteredGraphItems?.length || 0}
        itemsPerPage={rows}
        rowHeight={67}
        minContentWidth={900}
        scrollable
        query={govActionQuery}
        items={filteredTableItems}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof TreasuryWithdrawalsTableColumns,
            ) -
            columnsOrder.indexOf(b.key as keyof TreasuryWithdrawalsTableColumns)
          );
        })}
        onOrderChange={setColumnsOrder}
        renderDisplayText={(count, total) =>
          t("common:table.displaying", { count, total })
        }
        noItemsLabel={t("common:table.noItems")}
      />
    </>
  );
};
