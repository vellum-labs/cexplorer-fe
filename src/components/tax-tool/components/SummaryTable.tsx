import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import {
  Copy,
  Tooltip,
  formatNumber,
  Badge,
  Pagination,
} from "@vellumlabs/cexplorer-sdk";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useMemo, useState, useCallback } from "react";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { useTaxToolSummaryTableStore } from "@/stores/tables/taxToolSummaryTableStore";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface SummaryData {
  period: string;
  epochs: number;
  ada: number;
  usd: number;
  secondary: number;
}

interface SummaryTableProps {
  data: SummaryData[];
  secondaryCurrency: Currencies;
  query: UseQueryResult<any, unknown>;
  isOldestMonthIncomplete?: boolean;
}

export const SummaryTable: FC<SummaryTableProps> = ({
  data,
  secondaryCurrency,
  query,
  isOldestMonthIncomplete = false,
}) => {
  const { t } = useAppTranslation("common");
  const showSecondaryCurrency = secondaryCurrency !== "usd";
  const {
    columnsVisibility,
    setColumnVisibility,
    rows: storedRows,
    setRows: setStoredRows,
  } = useTaxToolSummaryTableStore();
  const [page, setPage] = useState(1);

  const itemsPerPage = storedRows;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, page, itemsPerPage]);

  const handleRowsChange = useCallback(
    (rows: number) => {
      setStoredRows(rows);
      setPage(1);
    },
    [setStoredRows],
  );

  const formatPeriod = (period: string) => {
    const [year, month] = period.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    });
  };

  const columnLabels = useMemo(
    () => ({
      period: t("taxTool.columns.period"),
      epochs: t("taxTool.columns.epochs"),
      rewards_ada: t("taxTool.columns.rewardsAda"),
      rewards_usd: t("taxTool.columns.rewardsUsd"),
      rewards_secondary: t("taxTool.columns.rewardsCurrency", { currency: secondaryCurrency.toUpperCase() }),
    }),
    [secondaryCurrency, t],
  );

  const columns = useMemo(
    () => [
      {
        key: "period",
        title: columnLabels.period,
        visible: columnsVisibility.period,
        widthPx: 150,
        render: (item: SummaryData) => {
          const oldestPeriod = data[data.length - 1]?.period;
          const isOldest = item.period === oldestPeriod;
          const showIncompleteBadge = isOldest && isOldestMonthIncomplete;
          return (
            <div className='flex items-center gap-1'>
              <span className='font-medium'>{formatPeriod(item.period)}</span>
              {showIncompleteBadge && (
                <Tooltip content={t("taxTool.tooltips.incompleteMonth")}>
                  <Badge color='yellow'>{t("taxTool.incomplete")}</Badge>
                </Tooltip>
              )}
            </div>
          );
        },
      },
      {
        key: "epochs",
        title: columnLabels.epochs,
        visible: columnsVisibility.epochs,
        widthPx: 100,
        render: item => <span>{item.epochs}</span>,
      },
      {
        key: "rewards_ada",
        title: (
          <div className='flex w-full justify-end'>
            <Tooltip content={t("taxTool.tooltips.exchangeRatesEpoch")}>
              <div
                className='flex cursor-help items-center gap-1'
                style={{ pointerEvents: "auto" }}
              >
                {t("taxTool.columns.rewardsAda")}
                <QuestionMarkCircledIcon className='h-4 w-4 text-grayTextPrimary' />
              </div>
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.rewards_ada,
        render: item => (
          <div className='flex items-center justify-end gap-1'>
            <span>
              ₳{" "}
              {item.ada.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
            <Copy
              copyText={item.ada.toString()}
              className='translate-y-[1px]'
            />
          </div>
        ),
      },
      {
        key: "rewards_usd",
        title: (
          <div className='flex w-full justify-end'>
            <Tooltip content={t("taxTool.tooltips.exchangeRatesEpoch")}>
              <div
                className='flex cursor-help items-center gap-1'
                style={{ pointerEvents: "auto" }}
              >
                {t("taxTool.columns.rewardsUsd")}
                <QuestionMarkCircledIcon className='h-4 w-4 text-grayTextPrimary' />
              </div>
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.rewards_usd,
        render: item => (
          <div className='flex items-center justify-end gap-1'>
            <span>USD {formatNumber(item.usd.toFixed(2))}</span>
            <Copy
              copyText={item.usd.toFixed(2)}
              className='translate-y-[1px]'
            />
          </div>
        ),
      },
      {
        key: "rewards_secondary",
        title: (
          <div className='flex w-full justify-end'>
            <Tooltip content={t("taxTool.tooltips.exchangeRatesEpoch")}>
              <div
                className='flex cursor-help items-center gap-1'
                style={{ pointerEvents: "auto" }}
              >
                {t("taxTool.columns.rewardsCurrency", { currency: secondaryCurrency.toUpperCase() })}
                <QuestionMarkCircledIcon className='h-4 w-4 text-grayTextPrimary' />
              </div>
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.rewards_secondary && showSecondaryCurrency,
        render: item => (
          <div className='flex items-center justify-end gap-1'>
            <span>
              {formatNumber(item.secondary.toFixed(2))}{" "}
              {secondaryCurrency.toUpperCase()}
            </span>
            <Copy
              copyText={item.secondary.toFixed(2)}
              className='translate-y-[1px]'
            />
          </div>
        ),
      },
    ],
    [
      columnLabels.period,
      columnLabels.epochs,
      columnsVisibility.period,
      columnsVisibility.epochs,
      columnsVisibility.rewards_ada,
      columnsVisibility.rewards_secondary,
      columnsVisibility.rewards_usd,
      secondaryCurrency,
      showSecondaryCurrency,
      data,
      isOldestMonthIncomplete,
    ],
  );

  const columnsOptions = useMemo(() => {
    const baseOptions = [
      "period",
      "epochs",
      "rewards_ada",
      "rewards_usd",
    ] as const;

    const options = baseOptions.map(key => ({
      label: columnLabels[key],
      isVisible: columnsVisibility[key],
      onClick: () => setColumnVisibility(key, !columnsVisibility[key]),
    }));

    if (!showSecondaryCurrency) {
      return options;
    }

    return [
      ...options,
      {
        label: columnLabels.rewards_secondary,
        isVisible: columnsVisibility.rewards_secondary,
        onClick: () =>
          setColumnVisibility(
            "rewards_secondary",
            !columnsVisibility.rewards_secondary,
          ),
      },
    ];
  }, [
    columnLabels,
    columnsVisibility,
    setColumnVisibility,
    showSecondaryCurrency,
  ]);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-text-md font-semibold'>{t("taxTool.summary")}</h3>
        <div className='flex items-center gap-1'>
          <TableSettingsDropdown
            rows={itemsPerPage}
            setRows={handleRowsChange}
            columnsOptions={columnsOptions}
          />
          <ExportButton
            columns={columns
              .filter(col => col.visible)
              .map(col => ({ ...col, widthPx: col.widthPx ?? 150 }))}
            items={data}
          />
        </div>
      </div>
      <GlobalTable
        type='default'
        pagination={false}
        scrollable
        query={query}
        items={paginatedData}
        columns={columns}
        disableDrag
      />
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
