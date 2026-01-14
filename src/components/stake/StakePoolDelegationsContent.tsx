import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { accountDelegationsTableOptions } from "@/constants/tables/accountDelegationsTableOptions";
import { useFetchDelegations } from "@/services/delegations";
import { MultiDelegationsTable } from "./MultiDelegationsTable";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";
import type { DelegationData } from "@/types/delegationTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { PoolDelegatorsColumns, TableColumns } from "@/types/tableTypes";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import { Link, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState, useMemo, type FC } from "react";
import { ExternalLink } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface StakePoolDelegationsContentProps {
  address: string;
  miscConst: MiscConstResponseData | undefined;
}

export const StakePoolDelegationsContent: FC<
  StakePoolDelegationsContentProps
> = ({ address, miscConst }) => {
  const { t } = useAppTranslation("pages");
  const [totalItems, setTotalItems] = useState(0);
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/stake/$stakeAddr" });
  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    rows,
    setRows,
    setColumnVisibility,
  } = usePoolDelegatorsTableStore();

  const delegationQuery = useFetchDelegations(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    address,
  );

  const items = delegationQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = delegationQuery.data?.pages[0].data.count;

  const delegationColumns: TableColumns<DelegationData> = useMemo(
    () => [
      {
        key: "date",
        render: item => {
          return (
            <DateCell
              time={format(
                slotToDate(
                  item.tx.slot_no,
                  miscConst?.epoch_stat.pots.slot_no ?? 0,
                  miscConst?.epoch_stat.epoch.start_time ?? "",
                ),
                "yyy-MM-dd HH:mm:ss",
              )}
            />
          );
        },
        jsonFormat: item => {
          if (
            !format(
              slotToDate(
                item.tx.slot_no,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )
          ) {
            return "-";
          }

          return format(
            slotToDate(
              item.tx.slot_no,
              miscConst?.epoch_stat.pots.slot_no ?? 0,
              miscConst?.epoch_stat.epoch.start_time ?? "",
            ),
            "yyy-MM-dd HH:mm:ss",
          );
        },
        title: <p>{t("common:labels.date")}</p>,
        visible: columnsVisibility.date,
        widthPx: 80,
      },
      {
        key: "active_in",
        render: item => (
          <div className='flex flex-col items-end gap-1/2'>
            {item?.active_epoch_no}
          </div>
        ),
        title: (
          <p className='w-full text-right'>
            {t("stake.detailPage.poolDelegationsTable.activeEpoch")}
          </p>
        ),
        visible: columnsVisibility.active_in,
        widthPx: 50,
      },
      {
        key: "address",
        render: item => (
          <div className='flex items-center gap-1/2'>
            <PoolCell
              poolInfo={item.pool.live}
              poolImageUrl={generateImageUrl(item.pool.live.id, "ico", "pool")}
            />
          </div>
        ),
        jsonFormat: item => {
          if (!item.pool.live.id) {
            return "-";
          }

          const id = item.pool.live.id;
          const ticker = item.pool.live.meta?.ticker;
          const name = item.pool.live.meta?.name;

          return ticker && name ? `[${ticker}] ${name}` : id;
        },
        title: t("stake.detailPage.poolDelegationsTable.stakePool"),
        visible: columnsVisibility.address,
        widthPx: 110,
      },
      {
        key: "amount",
        render: item => (
          <div className='flex flex-col items-end gap-1/2'>
            <AdaWithTooltip data={item?.active_stake ?? 0} />
          </div>
        ),
        title: (
          <div className='flex w-full justify-end'>
            <span>{t("common:labels.activeStake")}</span>
          </div>
        ),
        visible: columnsVisibility.amount,
        widthPx: 60,
      },
      {
        key: "loyalty",
        render: item => {
          const loyalty = calculateLoyaltyDays(
            item.tx?.slot_no,
            miscConst?.epoch_stat?.pots?.slot_no ?? 0,
          );

          return <p className='text-right'>{loyalty < 0 ? 0 : loyalty}d</p>;
        },
        title: (
          <div className='flex w-full justify-end'>
            <div className='flex w-fit cursor-pointer items-center gap-1/2 text-right'>
              <span>{t("common:labels.loyalty")}</span>
            </div>
          </div>
        ),
        visible: columnsVisibility.loyalty,
        widthPx: 80,
      },
      {
        key: "registered",
        render: item => {
          return (
            <DateCell
              className='text-right'
              time={format(
                slotToDate(
                  item.tx?.slot_no,
                  miscConst?.epoch_stat.pots.slot_no ?? 0,
                  miscConst?.epoch_stat.epoch.start_time ?? "",
                ),
                "yyy-MM-dd HH:mm:ss",
              )}
            />
          );
        },
        jsonFormat: item => {
          if (
            !format(
              slotToDate(
                item.tx?.slot_no,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )
          ) {
            return "-";
          }

          return format(
            slotToDate(
              item.tx?.slot_no,
              miscConst?.epoch_stat.pots.slot_no ?? 0,
              miscConst?.epoch_stat.epoch.start_time ?? "",
            ),
            "yyy-MM-dd HH:mm:ss",
          );
        },
        title: (
          <p className='w-full text-right'>{t("common:labels.registered")}</p>
        ),
        visible: columnsVisibility.registered,
        widthPx: 80,
      },
      {
        key: "tx",
        render: item => (
          <div className='flex items-center justify-end'>
            <Link
              to='/tx/$hash'
              params={{ hash: item.tx.hash }}
              className='text-primary'
            >
              <ExternalLink size={16} />
            </Link>
          </div>
        ),
        jsonFormat: item => item.tx.hash,
        title: (
          <div className='flex w-full justify-end'>
            <span>{t("common:labels.tx")}</span>
          </div>
        ),
        visible: columnsVisibility.tx,
        widthPx: 50,
      },
    ],
    [columnsVisibility, miscConst],
  );

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between gap-1'>
          <h3 className='my-2'>
            {t("stake.detailPage.poolDelegationsTable.delegationHistory")}
          </h3>
          <div className='flex items-center gap-1'>
            <ExportButton columns={delegationColumns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={accountDelegationsTableOptions.map(item => {
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
          rowHeight={69}
          scrollable
          query={delegationQuery}
          items={items}
          columns={delegationColumns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof PoolDelegatorsColumns) -
              columnsOrder.indexOf(b.key as keyof PoolDelegatorsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
          renderDisplayText={(count, total) =>
            t("common:table.displaying", { count, total })
          }
          noItemsLabel={t("common:table.noItems")}
        />
      </div>
      <MultiDelegationsTable address={address} miscConst={miscConst} />
    </section>
  );
};
