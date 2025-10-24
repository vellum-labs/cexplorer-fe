import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import { Copy, Tooltip, formatNumber } from "@vellumlabs/cexplorer-sdk";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import GlobalTable from "@/components/table/GlobalTable";
import type { Column } from "@/components/table/GlobalTable";
import { useMemo } from "react";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import ExportButton from "@/components/table/ExportButton";
import type { TableColumns } from "@/types/tableTypes";
import { useTaxToolSummaryTableStore } from "@/stores/tables/taxToolSummaryTableStore";
import { useStaticQuery } from "@/hooks/useStaticQuery";

interface SummaryData {
  period: string;
  ada: number;
  usd: number;
  secondary: number;
}

interface SummaryTableProps {
  data: SummaryData[];
  secondaryCurrency: Currencies;
}

export const SummaryTable: FC<SummaryTableProps> = ({
  data,
  secondaryCurrency,
}) => {
  const showSecondaryCurrency = secondaryCurrency !== "usd";
  const { columnsVisibility, setColumnVisibility } =
    useTaxToolSummaryTableStore();

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
      period: "Period",
      rewards_ada: "Rewards ADA",
      rewards_usd: "Rewards USD",
      rewards_secondary: `Rewards ${secondaryCurrency.toUpperCase()}`,
    }),
    [secondaryCurrency],
  );

  const query = useStaticQuery(data);

  const columns: Column<SummaryData>[] = useMemo(
    () => [
      {
        key: "period",
        title: columnLabels.period,
        visible: columnsVisibility.period,
        widthPx: 150,
        render: item => (
          <span className='font-medium'>{formatPeriod(item.period)}</span>
        ),
      },
      {
        key: "rewards_ada",
        title: (
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            Rewards ADA
            <Tooltip content='Exchange rates from the epoch end date.'>
              <QuestionMarkCircledIcon className='h-4 w-4 cursor-help text-grayTextPrimary' />
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
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            Rewards USD
            <Tooltip content='Exchange rates from the epoch end date.'>
              <QuestionMarkCircledIcon className='h-4 w-4 cursor-help text-grayTextPrimary' />
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
          <div className='flex w-full items-center justify-end gap-1 text-right'>
            Rewards {secondaryCurrency.toUpperCase()}
            <Tooltip content='Exchange rates from the epoch end date.'>
              <QuestionMarkCircledIcon className='h-4 w-4 cursor-help text-grayTextPrimary' />
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
      columnsVisibility.period,
      columnsVisibility.rewards_ada,
      columnsVisibility.rewards_secondary,
      columnsVisibility.rewards_usd,
      secondaryCurrency,
      showSecondaryCurrency,
    ],
  );

  const exportColumns = useMemo<TableColumns<SummaryData>>(
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
    const baseOptions = ["period", "rewards_ada", "rewards_usd"] as const;

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
        <h3 className='text-text-md font-semibold'>Summary</h3>
        <div className='flex items-center gap-1'>
          <TableSettingsDropdown
            rows={data.length || 0}
            visibleRows={false}
            setRows={() => undefined}
            columnsOptions={columnsOptions}
          />
          <ExportButton columns={exportColumns} items={data} />
        </div>
      </div>
      <GlobalTable
        type='default'
        pagination={false}
        scrollable
        query={query}
        items={data}
        columns={columns}
        disableDrag
      />
    </div>
  );
};
