import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { DrepHashCell } from "@/components/drep/DrepHashCell";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { ScriptBadge } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { drepRegistrationsTableOptions } from "@/constants/tables/drepRegistrationsTableOptions";
import { useFetchDrepUpdates } from "@/services/tx";
import { useDrepRegistrationsTableStore } from "@/stores/tables/drepRegistrationsTableStore";
import type { DrepRegistrationsData } from "@/types/drepTypes";
import type {
  DrepRegistrationsColumns,
  TableColumns,
} from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const DrepUpdatesPage = () => {
  const { t } = useAppTranslation("common");
  const [totalItems, setTotalItems] = useState(0);
  const { page } = useSearch({ from: "/drep/updates" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = useDrepRegistrationsTableStore();

  const query = useFetchDrepUpdates(rows, (page ?? 1) * rows - rows);
  const count = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<DrepRegistrationsData> = [
    {
      key: "date",
      render: item => <DateCell time={item.block.time} />,
      jsonFormat: item => {
        if (!item.block.time) {
          return "-";
        }

        return item.block.time;
      },
      title: t("drep.columns.date"),
      visible: columnsVisibility.date,
      widthPx: 30,
    },
    {
      key: "view",
      render: item => <DrepHashCell view={item.data.view} />,
      jsonFormat: item => {
        if (!item?.data.view) {
          return "-";
        }

        return item?.data?.view;
      },
      title: <p>{t("drep.columns.drep")}</p>,
      visible: columnsVisibility.view,
      widthPx: 50,
    },
    {
      key: "type",
      render: item => <ScriptBadge isScript={item.data.has_script} />,
      title: t("drep.columns.type"),
      visible: columnsVisibility.type,
      widthPx: 50,
    },
    {
      key: "deposit",
      render: item => (
        <div className='flex justify-end'>
          <AdaWithTooltip data={item.data.deposit} />
        </div>
      ),
      title: <p className='w-full text-right'>{t("drep.columns.deposit")}</p>,
      visible: columnsVisibility.deposit,
      widthPx: 40,
    },
    {
      key: "hash",
      render: item => <HashCell hash={item.tx.hash} />,
      jsonFormat: item => {
        if (!item.tx.hash) {
          return "-";
        }

        return item.tx.hash;
      },
      title: t("drep.columns.txHash"),
      visible: columnsVisibility.hash,
      widthPx: 40,
    },
    {
      key: "epoch_block",
      render: item => (
        <div className='flex items-center justify-end gap-1/2'>
          <EpochCell no={item.block.epoch_no} /> /{" "}
          <BlockCell hash={item.block.hash} no={item.block.no} />
        </div>
      ),
      jsonFormat: item => {
        if (!item.block.epoch_no || !item.block.no) {
          return "-";
        }

        return `${item.block.epoch_no}/${item.block.no}`;
      },
      title: (
        <p className='w-full text-right'>{t("drep.columns.epochBlock")}</p>
      ),
      visible: columnsVisibility.epoch_block,
      widthPx: 40,
    },
  ];

  useEffect(() => {
    if (count && count !== totalItems) {
      setTotalItems(count);
    }
  }, [count, totalItems]);

  return (
    <PageBase
      title={t("drep.updates.title")}
      breadcrumbItems={[
        {
          label: (
            <span className='inline pt-1/2'>
              {t("governance.breadcrumbs.governance")}
            </span>
          ),
          link: "/gov",
        },
        {
          label: (
            <span className='inline pt-1/2'>
              {t("drep.breadcrumbs.delegatedRepresentatives")}
            </span>
          ),
          link: "/drep",
        },
        { label: t("drep.updates.breadcrumb") },
      ]}
      metadataTitle='drepUpdates'
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full items-center justify-between gap-1'>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              {t("drep.updates.total", {
                count: formatNumber(totalItems ?? 0),
              })}
            </h3>
          )}
          <div className='flex items-center gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("table.rows")}
              columnsOptions={drepRegistrationsTableOptions.map(item => {
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
          itemsPerPage={20}
          scrollable
          query={query}
          items={items ?? []}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof DrepRegistrationsColumns) -
              columnsOrder.indexOf(b.key as keyof DrepRegistrationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
          renderDisplayText={(count, total) =>
            t("table.displaying", { count, total })
          }
          noItemsLabel={t("table.noItems")}
        />
      </section>
    </PageBase>
  );
};
