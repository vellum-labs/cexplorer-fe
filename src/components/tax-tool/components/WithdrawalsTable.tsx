import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import type { Withdrawal } from "@/types/accountTypes";
import {
  Copy,
  Tooltip,
  AdaWithTooltip,
  formatNumber,
  formatDate,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo } from "react";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { useTaxToolWithdrawalsTableStore } from "@/stores/tables/taxToolWithdrawalsTableStore";

interface WithdrawalsTableProps {
  query: UseInfiniteQueryResult<InfiniteData<any>, unknown>;
  data: Withdrawal[];
  secondaryCurrency: Currencies;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange?: (rows: number) => void;
}

export const WithdrawalsTable: FC<WithdrawalsTableProps> = ({
  query,
  data,
  secondaryCurrency,
  currentPage,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const showSecondaryCurrency = secondaryCurrency !== "usd";
  const adaUsdPrice = useAdaPriceWithHistory("usd");
  const adaSecondaryPrice = useAdaPriceWithHistory(secondaryCurrency);

  const {
    columnsVisibility,
    setColumnVisibility,
    setRows: setStoredRows,
  } = useTaxToolWithdrawalsTableStore();

  useEffect(() => {
    setStoredRows(itemsPerPage);
  }, [itemsPerPage, setStoredRows]);

  const calculateCurrencyValues = useCallback(
    (
      adaAmount: number,
    ): {
      usd: number;
      secondary: number;
      adaUsd: number;
      adaSecondary: number;
    } => {
      const usdRate = adaUsdPrice.todayValue ?? 0;
      const secondaryRate =
        secondaryCurrency === "usd"
          ? usdRate
          : (adaSecondaryPrice.todayValue ?? 0);
      const usdValue = adaAmount * usdRate;
      const secondaryValue = adaAmount * secondaryRate;

      return {
        usd: usdValue,
        secondary: secondaryValue,
        adaUsd: usdRate,
        adaSecondary: secondaryRate,
      };
    },
    [adaSecondaryPrice.todayValue, adaUsdPrice.todayValue, secondaryCurrency],
  );

  const formatRate = (rate: number) =>
    Number.isFinite(rate) ? rate.toFixed(3) : "0.000";

  const columnLabels = useMemo(
    () => ({
      timestamp: "Withdrawal timestamp",
      transaction: "Transaction",
      rewards_ada: "Rewards withdrawn ADA",
      rewards_usd: "Rewards withdrawn USD",
      rewards_secondary: `Rewards withdrawn ${secondaryCurrency.toUpperCase()}`,
      ada_usd_rate: "ADA/USD",
      ada_secondary_rate: `ADA/${secondaryCurrency.toUpperCase()}`,
    }),
    [secondaryCurrency],
  );

  const columns = useMemo(
    () => [
      {
        key: "timestamp",
        title: (
          <div className='flex w-full justify-start'>
            <Tooltip content='Exchange rates from the epoch end date.'>
              <div className='flex items-center gap-1 cursor-help' style={{pointerEvents: 'auto'}}>
                {columnLabels.timestamp}
                <QuestionMarkCircledIcon className='h-4 w-4 text-grayTextPrimary' />
              </div>
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.timestamp,
        widthPx: 180,
        render: item => {
          const time = item.block.time;
          if (!time) return "-";

          return formatDate(time, false, false, true, true);
        },
      },
      {
        key: "transaction",
        title: columnLabels.transaction,
        visible: columnsVisibility.transaction,
        widthPx: 150,
        render: item => (
          <Link
            to='/tx/$hash'
            params={{ hash: item.tx.hash }}
            className='text-primary hover:underline'
          >
            {item.tx.hash.slice(0, 12)}...
          </Link>
        ),
      },
      {
        key: "rewards_ada",
        title: (
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            {columnLabels.rewards_ada}
          </div>
        ),
        visible: columnsVisibility.rewards_ada,
        render: item => (
          <div className='flex items-center justify-end'>
            <AdaWithTooltip data={item.amount} />
          </div>
        ),
      },
      {
        key: "rewards_usd",
        title: (
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            {columnLabels.rewards_usd}
          </div>
        ),
        visible: columnsVisibility.rewards_usd,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount);
          return (
            <div className='flex items-center justify-end gap-1'>
              <span>USD {formatNumber(values.usd.toFixed(2))}</span>
              <Copy
                copyText={values.usd.toFixed(2)}
                className='translate-y-[1px]'
              />
            </div>
          );
        },
      },
      {
        key: "rewards_secondary",
        title: (
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            {columnLabels.rewards_secondary}
          </div>
        ),
        visible: columnsVisibility.rewards_secondary && showSecondaryCurrency,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount);
          return (
            <div className='flex items-center justify-end gap-1'>
              <span>
                {formatNumber(values.secondary.toFixed(2))}{" "}
                {secondaryCurrency.toUpperCase()}
              </span>
              <Copy
                copyText={values.secondary.toFixed(2)}
                className='translate-y-[1px]'
              />
            </div>
          );
        },
      },
      {
        key: "ada_usd_rate",
        title: (
          <div className='flex w-full justify-end'>
            <Tooltip content='Exchange rates from the epoch end date.'>
              <div className='flex items-center gap-1 cursor-help' style={{pointerEvents: 'auto'}}>
                {columnLabels.ada_usd_rate}
                <QuestionMarkCircledIcon className='h-4 w-4 text-grayTextPrimary' />
              </div>
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.ada_usd_rate,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount);
          return (
            <div className='text-right'>USD {formatRate(values.adaUsd)}</div>
          );
        },
      },
      {
        key: "ada_secondary_rate",
        title: (
          <div className='flex w-full justify-end'>
            <Tooltip content='Exchange rates from the epoch end date.'>
              <div className='flex items-center gap-1 cursor-help' style={{pointerEvents: 'auto'}}>
                {columnLabels.ada_secondary_rate}
                <QuestionMarkCircledIcon className='h-4 w-4 text-grayTextPrimary' />
              </div>
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.ada_secondary_rate && showSecondaryCurrency,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount);
          return (
            <div className='text-right'>{formatRate(values.adaSecondary)}</div>
          );
        },
      },
    ],
    [
      calculateCurrencyValues,
      columnLabels.ada_secondary_rate,
      columnLabels.ada_usd_rate,
      columnLabels.rewards_ada,
      columnLabels.rewards_secondary,
      columnLabels.rewards_usd,
      columnLabels.timestamp,
      columnLabels.transaction,
      columnsVisibility.ada_secondary_rate,
      columnsVisibility.ada_usd_rate,
      columnsVisibility.rewards_ada,
      columnsVisibility.rewards_secondary,
      columnsVisibility.rewards_usd,
      columnsVisibility.timestamp,
      columnsVisibility.transaction,
      secondaryCurrency,
      showSecondaryCurrency,
    ],
  );

  const columnsOptions = useMemo(() => {
    const baseKeys = [
      "timestamp",
      "transaction",
      "rewards_ada",
      "rewards_usd",
      "ada_usd_rate",
    ] as const;

    const baseOptions = baseKeys.map(key => ({
      label: columnLabels[key],
      isVisible: columnsVisibility[key],
      onClick: () => setColumnVisibility(key, !columnsVisibility[key]),
    }));

    if (!showSecondaryCurrency) {
      return baseOptions;
    }

    return [
      ...baseOptions,
      {
        label: columnLabels.rewards_secondary,
        isVisible: columnsVisibility.rewards_secondary,
        onClick: () =>
          setColumnVisibility(
            "rewards_secondary",
            !columnsVisibility.rewards_secondary,
          ),
      },
      {
        label: columnLabels.ada_secondary_rate,
        isVisible: columnsVisibility.ada_secondary_rate,
        onClick: () =>
          setColumnVisibility(
            "ada_secondary_rate",
            !columnsVisibility.ada_secondary_rate,
          ),
      },
    ];
  }, [
    columnLabels,
    columnsVisibility,
    setColumnVisibility,
    showSecondaryCurrency,
  ]);

  const handleRowsChange = useCallback(
    (rows: number) => {
      setStoredRows(rows);
      onItemsPerPageChange?.(rows);
    },
    [onItemsPerPageChange, setStoredRows],
  );

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-text-md font-semibold'>Withdrawals</h3>
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
            currentPage={currentPage}
          />
        </div>
      </div>
      <GlobalTable
        type='infinite'
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        scrollable
        query={query}
        items={data}
        columns={columns}
        disableDrag
      />
    </div>
  );
};
