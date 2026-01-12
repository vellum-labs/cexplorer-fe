import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { PurposeBadge } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { scriptDetailUsesTableOptions } from "@/constants/tables/scriptDetailUsesTableOptions";
import { useFetchScriptDetailRedeemer } from "@/services/script";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useScriptDetailUsesTableStore } from "@/stores/tables/scriptDetailUsesTableStore";
import type { ScriptDetailRedeemerData } from "@/types/scriptTypes";
import type { ScriptDetailUsesColumns, TableColumns } from "@/types/tableTypes";
import {
  formatNumber,
  formatNumberWithSuffix,
} from "@vellumlabs/cexplorer-sdk";
import { getPercentageColor } from "@/utils/getPercentageColor";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ScriptDetailUsesTab = () => {
  const { t } = useAppTranslation("common");
  const route = getRouteApi("/script/$hash");
  const { hash } = route.useParams();
  const { page } = route.useSearch();
  const { infiniteScrolling } = useInfiniteScrollingStore();

  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useScriptDetailUsesTableStore();

  const query = useFetchScriptDetailRedeemer(
    hash,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    rows,
  );
  const items = query.data?.pages.flatMap(page => page.data.data);
  const totalCount = query.data?.pages[0].data.count;
  const [totalItems, setTotalItems] = useState<number>(0);

  const columns: TableColumns<ScriptDetailRedeemerData> = [
    {
      key: "date",
      render: item => <DateCell time={item.tx.time} />,
      jsonFormat: item => {
        if (!item.tx.time) {
          return "-";
        }

        return item.tx.time;
      },
      title: t("script.table.date"),
      visible: columnsVisibility.date,
      widthPx: 30,
    },
    {
      key: "hash",
      render: item => <HashCell enableHover hash={item.tx.hash} />,
      jsonFormat: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: t("script.table.hash"),
      visible: columnsVisibility.hash,
      widthPx: 50,
    },
    {
      key: "output",
      render: item => (
        <p>
          <AdaWithTooltip data={item.tx.out_sum} />
        </p>
      ),
      title: t("script.table.output"),
      visible: columnsVisibility.output,
      widthPx: 20,
    },
    {
      key: "fee",
      render: item => (
        <p>
          <AdaWithTooltip data={item.fee} />
        </p>
      ),
      title: t("script.table.fee"),
      visible: columnsVisibility.fee,
      widthPx: 20,
    },
    {
      key: "memory",
      render: item => (
        <div className='flex flex-col'>
          <p className='text-right'>{formatNumberWithSuffix(item.unit_mem)}</p>
          <p
            style={{
              color: getPercentageColor(
                item.epoch_param.max_tx_ex_mem / item.unit_mem,
              ),
            }}
            className='text-right text-text-xs font-medium'
          >
            {(item.epoch_param.max_tx_ex_mem / item.unit_mem).toFixed(2)}%
          </p>
        </div>
      ),
      jsonFormat: item => {
        return (
          "Size: " +
          formatNumberWithSuffix(item.unit_mem) +
          " Percentage: " +
          (item.epoch_param.max_tx_ex_mem / item.unit_mem).toFixed(2) +
          "%"
        );
      },
      title: <p className='w-full text-right'>{t("script.table.memory")}</p>,
      visible: columnsVisibility.memory,
      widthPx: 20,
    },
    {
      key: "steps",
      render: item => (
        <div className='flex flex-col'>
          <p className='text-right'>
            {formatNumberWithSuffix(item.unit_steps)}
          </p>
          <p
            style={{
              color: getPercentageColor(
                item.epoch_param.max_tx_ex_steps / item.unit_steps,
              ),
            }}
            className='text-right text-text-xs font-medium'
          >
            {(item.epoch_param.max_tx_ex_steps / item.unit_steps).toFixed(2)}%
          </p>
        </div>
      ),
      jsonFormat: item => {
        return (
          "Size: " +
          formatNumberWithSuffix(item.unit_steps) +
          " Percentage: " +
          (item.epoch_param.max_tx_ex_steps / item.unit_steps).toFixed(2) +
          "%"
        );
      },
      title: <p className='w-full text-right'>{t("script.table.cpuSteps")}</p>,
      visible: columnsVisibility.steps,
      widthPx: 20,
    },
    {
      key: "purpose",
      render: item => (
        <PurposeBadge className='ml-auto' purpose={item.purpose} />
      ),
      jsonFormat: item => {
        if (!item.purpose) {
          return "-";
        }

        return item.purpose.slice(0, 1).toUpperCase() + item.purpose.slice(1);
      },
      title: <p className='w-full text-right'>{t("script.table.purpose")}</p>,
      visible: columnsVisibility.purpose,
      widthPx: 40,
    },
  ];

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <div className='flex w-full max-w-desktop flex-col'>
      <div className='flex w-full items-start justify-between'>
        <div>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              {t("script.totalUses", { count: formatNumber(totalItems) })}
            </h3>
          )}
        </div>
        <div className='mb-2 ml-auto flex w-fit items-center justify-end gap-1'>
          <ExportButton columns={columns} items={items} />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={scriptDetailUsesTableOptions.map(item => {
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
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        minContentWidth={1200}
        rowHeight={69}
        scrollable
        query={query}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof ScriptDetailUsesColumns) -
            columnsOrder.indexOf(b.key as keyof ScriptDetailUsesColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
