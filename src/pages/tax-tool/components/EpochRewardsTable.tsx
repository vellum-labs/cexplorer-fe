import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import type { RewardItem } from "@/types/accountTypes";
import {
  Copy,
  Tooltip,
  AdaWithTooltip,
  formatDate,
  formatNumber,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import GlobalTable from "@/components/table/GlobalTable";
import type { Column } from "@/components/table/GlobalTable";
import type { UseQueryResult } from "@tanstack/react-query";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Pagination } from "@vellumlabs/cexplorer-sdk";
import {
  useCallback,
  useEffect,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import ExportButton from "@/components/table/ExportButton";
import type { TableColumns } from "@/types/tableTypes";
import { useTaxToolEpochRewardsTableStore } from "@/stores/tables/taxToolEpochRewardsTableStore";

interface EpochRewardsTableProps {
  query: UseQueryResult<any, unknown>;
  data: RewardItem[];
  secondaryCurrency: Currencies;
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange?: (rows: number) => void;
}

export const EpochRewardsTable: FC<EpochRewardsTableProps> = ({
  query,
  data,
  secondaryCurrency,
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const showSecondaryCurrency = secondaryCurrency !== "usd";

  const {
    columnsVisibility,
    setColumnVisibility,
    setRows: setStoredRows,
  } = useTaxToolEpochRewardsTableStore();

  useEffect(() => {
    setStoredRows(itemsPerPage);
  }, [itemsPerPage, setStoredRows]);

  const adaPriceSecondary = useAdaPriceWithHistory(secondaryCurrency);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return formatDate(dateString, true);
  };

  const getAdaUsdRate = useCallback((reward: RewardItem): number => {
    if (
      !reward.spendable_epoch?.rate ||
      !Array.isArray(reward.spendable_epoch.rate)
    ) {
      return 0;
    }

    const rateData = reward.spendable_epoch.rate[0];
    if (
      !rateData?.ada ||
      !Array.isArray(rateData.ada) ||
      rateData.ada.length === 0
    ) {
      return 0;
    }

    return rateData.ada[0]?.close || 0;
  }, []);

  const getAdaSecondaryRate = useCallback((): number => {
    return adaPriceSecondary.todayValue || 0;
  }, [adaPriceSecondary.todayValue]);

  const calculateCurrencyValues = useCallback(
    (
      adaAmount: number,
      reward: RewardItem,
    ): {
      usd: number;
      secondary: number;
      adaUsd: number;
      adaSecondary: number;
    } => {
      const adaUsdRate = getAdaUsdRate(reward);

      if (!adaUsdRate) {
        return { usd: 0, secondary: 0, adaUsd: 0, adaSecondary: 0 };
      }

      const usdValue = adaAmount * adaUsdRate;
      const adaSecondaryRate = getAdaSecondaryRate();
      const secondaryValue = adaAmount * adaSecondaryRate;

      return {
        usd: usdValue,
        secondary: secondaryValue,
        adaUsd: adaUsdRate,
        adaSecondary: adaSecondaryRate,
      };
    },
    [getAdaSecondaryRate, getAdaUsdRate],
  );

  const formatRate = (rate: number) =>
    Number.isFinite(rate) ? rate.toFixed(3) : "0.000";

  const columnLabels = useMemo(
    () => ({
      epoch: "Epoch",
      end_time: "End Time",
      type: "Type",
      rewards_ada: "Rewards ADA",
      rewards_usd: "Rewards USD",
      rewards_secondary: `Rewards ${secondaryCurrency.toUpperCase()}`,
      ada_usd_rate: "ADA/USD",
      ada_secondary_rate: `ADA/${secondaryCurrency.toUpperCase()}`,
    }),
    [secondaryCurrency],
  );

  const columns: Column<RewardItem>[] = useMemo(
    () => [
      {
        key: "epoch",
        title: columnLabels.epoch,
        visible: columnsVisibility.epoch,
        widthPx: 100,
        render: item => (
          <Link
            to='/epoch/$no'
            params={{ no: String(item.earned_epoch) }}
            className='text-primary hover:underline'
          >
            {item.earned_epoch}
          </Link>
        ),
      },
      {
        key: "end_time",
        title: (
          <div className='flex items-center gap-1'>
            End Time
            <Tooltip content='Exchange rates from the epoch end date.'>
              <QuestionMarkCircledIcon className='h-4 w-4 cursor-help text-grayTextPrimary' />
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.end_time,
        widthPx: 180,
        render: item => (
          <span className='text-text-sm'>
            {formatDateTime(item.spendable_epoch.end_time)}
          </span>
        ),
      },
      {
        key: "type",
        title: columnLabels.type,
        visible: columnsVisibility.type,
        widthPx: 100,
        render: item => (
          <span className='capitalize'>{item.type || "Member"}</span>
        ),
      },
      {
        key: "rewards_ada",
        title: (
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            Rewards ADA
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
            Rewards USD
          </div>
        ),
        visible: columnsVisibility.rewards_usd,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount, item);
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
            Rewards {secondaryCurrency.toUpperCase()}
          </div>
        ),
        visible: columnsVisibility.rewards_secondary && showSecondaryCurrency,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount, item);
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
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            <span>ADA/USD</span>
            <Tooltip content='Exchange rates from the epoch end date.'>
              <QuestionMarkCircledIcon className='h-4 w-4 cursor-help text-grayTextPrimary' />
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.ada_usd_rate,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount, item);
          return (
            <div className='text-right'>USD {formatRate(values.adaUsd)}</div>
          );
        },
      },
      {
        key: "ada_secondary_rate",
        title: (
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            <span>ADA/{secondaryCurrency.toUpperCase()}</span>
            <Tooltip content='Exchange rates from the epoch end date.'>
              <QuestionMarkCircledIcon className='h-4 w-4 cursor-help text-grayTextPrimary' />
            </Tooltip>
          </div>
        ),
        visible: columnsVisibility.ada_secondary_rate && showSecondaryCurrency,
        render: item => {
          const adaAmount = item.amount / 1_000_000;
          const values = calculateCurrencyValues(adaAmount, item);
          return (
            <div className='text-right'>{formatRate(values.adaSecondary)}</div>
          );
        },
      },
    ],
    [
      calculateCurrencyValues,
      columnLabels.epoch,
      columnLabels.type,
      columnsVisibility.ada_secondary_rate,
      columnsVisibility.ada_usd_rate,
      columnsVisibility.end_time,
      columnsVisibility.epoch,
      columnsVisibility.rewards_ada,
      columnsVisibility.rewards_secondary,
      columnsVisibility.rewards_usd,
      columnsVisibility.type,
      secondaryCurrency,
      showSecondaryCurrency,
    ],
  );

  const exportColumns = useMemo<TableColumns<RewardItem>>(
    () =>
      columns
        .filter(column => column.visible)
        .map(column => ({
          key: column.key,
          title:
            columnLabels[column.key as keyof typeof columnLabels] ??
            column.title ??
            "",
          visible: Boolean(column.visible),
          widthPx: column.widthPx ?? 150,
          render: column.render,
        })),
    [columnLabels, columns],
  );

  const columnsOptions = useMemo(() => {
    const baseKeys = [
      "epoch",
      "end_time",
      "type",
      "rewards_ada",
      "rewards_usd",
      "ada_usd_rate",
    ] as const;

    const options = baseKeys.map(key => ({
      label: columnLabels[key],
      isVisible: columnsVisibility[key],
      onClick: () => setColumnVisibility(key, !columnsVisibility[key]),
    }));

    if (!showSecondaryCurrency) {
      return options;
    }

    const secondaryOptions = [
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

    return [...options, ...secondaryOptions];
  }, [
    columnLabels,
    columnsVisibility,
    setColumnVisibility,
    showSecondaryCurrency,
  ]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const handleRowsChange = useCallback(
    (rows: number) => {
      setStoredRows(rows);
      onItemsPerPageChange?.(rows);
      onPageChange(1);
    },
    [onItemsPerPageChange, onPageChange, setStoredRows],
  );

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-text-md font-semibold'>Epoch by epoch</h3>
        <div className='flex items-center gap-1'>
          <TableSettingsDropdown
            rows={itemsPerPage}
            setRows={handleRowsChange}
            columnsOptions={columnsOptions}
          />
          <ExportButton
            columns={exportColumns}
            items={data}
            currentPage={currentPage}
          />
        </div>
      </div>
      <GlobalTable
        type='default'
        pagination={false}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        scrollable
        query={query}
        items={data}
        columns={columns}
        disableDrag
      />
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={onPageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
