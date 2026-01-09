import type { ScriptDetailRedeemerData } from "@/types/scriptTypes";
import type {
  ScriptListInteractionsTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { PurposeBadge } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";

import { useFetchScriptDetailRedeemer } from "@/services/script";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useScriptListInteractionsTableStore } from "@/stores/tables/scriptListInteractionsTableStore";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { scriptListInteractionTableOptions } from "@/constants/tables/scriptListInteractionTableOptions";
import {
  formatNumber,
  formatNumberWithSuffix,
} from "@vellumlabs/cexplorer-sdk";
import { getPercentageColor } from "@/utils/getPercentageColor";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ScriptListInteractionsTab: FC = () => {
  const { t } = useAppTranslation("common");
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/script/" });

  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useScriptListInteractionsTableStore();

  const interactionsQuery = useFetchScriptDetailRedeemer(
    undefined,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    rows,
    true,
  );

  const items = interactionsQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = interactionsQuery.data?.pages[0].data.count;

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
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 30,
    },
    {
      key: "dapp",
      render: item => <HashCell enableHover hash={item.tx.hash} />,
      jsonFormat: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: "Hash",
      visible: columnsVisibility.dapp,
      widthPx: 50,
    },
    {
      key: "output",
      render: item => (
        <p>
          <AdaWithTooltip data={item.tx.out_sum} />
        </p>
      ),
      title: "Output",
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
      title: "Fee",
      visible: columnsVisibility.fee,
      widthPx: 20,
    },
    {
      key: "memory_used",
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
      title: <p className='w-full text-right'>Memory</p>,
      visible: columnsVisibility.memory_used,
      widthPx: 20,
    },
    {
      key: "cpu_steps",
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
      title: <p className='w-full text-right'>CPU steps</p>,
      visible: columnsVisibility.cpu_steps,
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
      title: <p className='w-full text-right'>Purpose</p>,
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
      <div className='flex w-full items-center justify-between'>
        <div>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              Total of {formatNumber(totalItems)} interactions
            </h3>
          )}
        </div>
        <div className='mb-2 ml-auto flex w-fit items-center justify-end gap-1'>
          <ExportButton columns={columns} items={items} />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={scriptListInteractionTableOptions.map(item => {
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
        query={interactionsQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof ScriptListInteractionsTableColumns,
            ) -
            columnsOrder.indexOf(
              b.key as keyof ScriptListInteractionsTableColumns,
            )
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
