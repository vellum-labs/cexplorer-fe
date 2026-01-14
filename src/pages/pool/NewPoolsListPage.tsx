import type { PoolData } from "@/types/poolTypes";
import type { NewPoolsColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { Check, X } from "lucide-react";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";

import { useFetchPoolsList } from "@/services/pools";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useNewPoolsListTableStore } from "@/stores/tables/newPoolsListTableStore";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFetchMiscBasic } from "@/services/misc";

import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { newPoolsTableOptions } from "@/constants/tables/newPoolsTableOptions";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const NewPoolsListPage: FC = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { page } = useSearch({ from: "/new-pools/" });
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useNewPoolsListTableStore();

  const [totalItems, setTotalItems] = useState<number>(0);
  const miscQuery = useFetchMiscBasic();
  const currentEpoch = miscQuery.data?.data.block.epoch_no;

  const poolsListQuery = useFetchPoolsList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    "desc",
    "new",
  );

  const totalPools = poolsListQuery.data?.pages[0].data.count;
  const items = poolsListQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<PoolData> = [
    {
      key: "date",
      render: item => <DateCell time={item?.pool_update?.active?.tx.time} />,
      jsonFormat: item => {
        if (!item?.pool_update?.active?.tx.time) {
          return "-";
        }

        return item?.pool_update?.active?.tx.time;
      },
      title: <p>{t("common:labels.date")}</p>,
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "pool",
      render: item => (
        <PoolCell
          poolInfo={{
            id: item.pool_id,
            meta: item.pool_name,
          }}
          poolImageUrl={generateImageUrl(item.pool_id, "ico", "pool")}
        />
      ),
      jsonFormat: item => {
        if (!item.pool_name.ticker && !item.pool_name.name && !item.pool_id) {
          return "-";
        }

        let format = "";

        if (item.pool_name.ticker || item.pool_name.name) {
          format += `Name: [${item.pool_name?.ticker ? item.pool_name?.ticker : ""}] ${item.pool_name?.name ? item.pool_name?.name : ""}, `;
        }

        if (item.pool_id) {
          format += `ID: ${item.pool_id}`;
        }

        return format;
      },
      title: t("common:labels.pool"),
      visible: columnsVisibility.pool,
      widthPx: 90,
    },
    {
      key: "epoch",
      render: item => (
        <EpochCell
          no={item.active_epochs}
          substractFromCurrent
          currentEpoch={currentEpoch}
        />
      ),
      title: <p className='w-full text-right'>{t("common:labels.epoch")}</p>,
      visible: columnsVisibility.epoch,
      widthPx: 15,
    },
    {
      key: "fees",
      render: item => (
        <div className='flex flex-col text-right text-grayTextPrimary'>
          <span>
            {item?.pool_update?.active?.margin
              ? (item.pool_update.active.margin * 100).toFixed(2)
              : 0}
            %
          </span>
          <span>
            <AdaWithTooltip data={item?.pool_update?.active?.fixed_cost ?? 0} />
          </span>
        </div>
      ),
      jsonFormat: item => {
        let format = "";

        if (
          !item?.pool_update?.active?.margin &&
          !item?.pool_update?.active?.fixed_cost
        ) {
          return "-";
        }

        if (item?.pool_update?.active?.margin) {
          format += `Percentage: ${(item.pool_update.active.margin * 100).toFixed(2)}%`;
        }

        if (item?.pool_update?.active?.fixed_cost) {
          format += `, Amount: ${lovelaceToAda(item?.pool_update?.active?.fixed_cost ?? 0)}`;
        }

        return format;
      },
      title: <p className='w-full text-right'>{t("common:labels.fees")}</p>,
      visible: columnsVisibility.fees,
      widthPx: 50,
    },
    {
      key: "pledge",
      render: item => {
        const pledge = item?.pool_update.live?.pledge ?? 0;
        const pledged = item?.pledged ?? 0;

        return (
          <div className='flex items-center justify-end gap-1/2'>
            {pledged >= pledge ? (
              <Check size={11} className='translate-y-[1px] stroke-[#17B26A]' />
            ) : (
              <X size={11} className='translate-y-[1px] stroke-[#F04438]' />
            )}

            <AdaWithTooltip data={item.pool_update?.active?.pledge ?? 0} />
          </div>
        );
      },
      title: <p className='w-full text-right'>{t("common:labels.pledge")}</p>,
      visible: columnsVisibility.pledge,
      widthPx: 40,
    },
    {
      key: "tx_hash",
      render: item => <HashCell hash={item?.pool_update?.active?.tx.hash} />,
      jsonFormat: item => {
        if (!item?.pool_update?.active?.tx.hash) {
          return "-";
        }

        return item?.pool_update?.active?.tx.hash;
      },
      title: <p>{t("common:labels.txHash")}</p>,
      visible: columnsVisibility.tx_hash,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalPools && totalPools !== totalItems) {
      setTotalItems(totalPools);
    }
  }, [totalPools, totalItems]);

  return (
    <PageBase
      metadataTitle='newPoolsList'
      title={t("pools.newPools.title")}
      breadcrumbItems={[{ label: t("pools.newPools.title") }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <h3>{t("pools.newPools.welcome")}</h3>

          <div className='mb-2 ml-auto flex w-fit justify-end gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={newPoolsTableOptions.map(item => {
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
          rowHeight={65}
          scrollable
          query={poolsListQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof NewPoolsColumns) -
              columnsOrder.indexOf(b.key as keyof NewPoolsColumns)
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
