import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { HashCell } from "@/components/tx/HashCell";
import { poolRegistrationsTableOptions } from "@/constants/tables/poolRegistrationsOptions";
import { useFetchPoolRegistrations } from "@/services/tx";
import { usePoolRegistrationsTableStore } from "@/stores/tables/poolRegistrationsTableStore";
import type { PoolRegistrationsData } from "@/types/poolTypes";
import type {
  PoolRegistrationsColumns,
  TableColumns,
} from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const PoolRegistrationsPage = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const [totalItems, setTotalItems] = useState(0);
  const { page } = useSearch({ from: "/pool/registrations" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolRegistrationsTableStore();

  const query = useFetchPoolRegistrations(rows, (page ?? 1) * rows - rows);
  const count = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);

  const tableColumnTranslations: Record<string, string> = {
    date: t("common:labels.date"),
    view: t("common:labels.pool"),
    deposit: t("common:labels.deposit"),
    pledge: t("common:labels.pledge"),
    fee: t("common:labels.fee"),
    hash: t("common:labels.txHash"),
    epoch_block: t("common:labels.epochBlock"),
  };

  const columns: TableColumns<PoolRegistrationsData> = [
    {
      key: "date",
      render: item => <DateCell time={item.block.time} />,
      jsonFormat: item => {
        if (!item.block.time) {
          return "-";
        }

        return item.block.time;
      },
      title: t("common:labels.date"),
      visible: columnsVisibility.date,
      widthPx: 30,
    },
    {
      key: "view",
      render: item => (
        <PoolCell
          poolInfo={{
            id: item.data.view,
            meta: item.data.meta,
          }}
          poolImageUrl={generateImageUrl(item.data.view, "ico", "pool")}
        />
      ),
      jsonFormat: item => {
        if (!item?.data.view) {
          return "-";
        }

        return item?.data?.view;
      },
      title: <p>{t("common:labels.pool")}</p>,
      visible: columnsVisibility.view,
      widthPx: 50,
    },
    {
      key: "deposit",
      render: item => (
        <div className='flex justify-end'>
          <AdaWithTooltip data={item.tx.deposit} />
        </div>
      ),
      title: <p className='w-full text-right'>{t("common:labels.deposit")}</p>,
      visible: columnsVisibility.deposit,
      widthPx: 40,
    },
    {
      key: "pledge",
      render: item => (
        <div className='flex justify-end'>
          <AdaWithTooltip data={item.data.pledge} />
        </div>
      ),
      title: <p className='w-full text-right'>{t("common:labels.pledge")}</p>,
      visible: columnsVisibility.pledge,
      widthPx: 40,
    },
    {
      key: "fee",
      render: item => (
        <div className='flex justify-end gap-1/2'>
          <span>{Number((item.data.margin * 100).toFixed(2))}%</span> +{" "}
          <AdaWithTooltip data={item.data.fixed_cost} />
        </div>
      ),
      title: <p className='w-full text-right'>{t("common:labels.fee")}</p>,
      visible: columnsVisibility.fee,
      widthPx: 50,
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
      title: t("common:labels.txHash"),
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
        <p className='w-full text-right'>{t("common:labels.epochBlock")}</p>
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
      metadataTitle='poolRegistrations'
      title={t("pools.registrations.title")}
      breadcrumbItems={[{ label: t("pools.registrations.title") }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full items-center justify-between gap-1'>
          {!totalItems ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px]'>
              {t("common:phrases.totalOf")} {formatNumber(totalItems ?? 0)}{" "}
              {t("pools.registrations.totalOfSuffix")}
            </h3>
          )}
          <div className='flex items-center gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={poolRegistrationsTableOptions.map(item => {
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
              columnsOrder.indexOf(a.key as keyof PoolRegistrationsColumns) -
              columnsOrder.indexOf(b.key as keyof PoolRegistrationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
          renderDisplayText={(count, total) =>
            t("common:table.displaying", { count, total })
          }
          noItemsLabel={t("common:table.noItems")}
        />
      </section>
    </PageBase>
  );
};
