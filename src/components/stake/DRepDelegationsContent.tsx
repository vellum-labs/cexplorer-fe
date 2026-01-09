import { useFetchDrepDelegations } from "@/services/delegations";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useMemo, type FC } from "react";
import type { DrepDelegationData } from "@/types/delegationTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { DrepDelegationsColumns, TableColumns } from "@/types/tableTypes";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import { format } from "date-fns";
import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { useDrepDelegationsTableStore } from "@/stores/tables/drepDelegationsTableStore";
import { ExternalLink } from "lucide-react";
import { accountDrepDelegationsTableOptions } from "@/constants/tables/accountDrepDelegationsTableOptions";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DRepDelegationsContentProps {
  address: string;
  miscConst: MiscConstResponseData | undefined;
}

export const DRepDelegationsContent: FC<DRepDelegationsContentProps> = ({
  address,
  miscConst,
}) => {
  const { t } = useAppTranslation("pages");
  const [totalItems, setTotalItems] = useState(0);
  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    rows,
    setRows,
    setColumnVisibility,
  } = useDrepDelegationsTableStore();

  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/stake/$stakeAddr" });

  const drepDelegationQuery = useFetchDrepDelegations(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    address,
  );

  const items = drepDelegationQuery.data?.pages.flatMap(page => page.data.data);
  const totalCount = drepDelegationQuery.data?.pages[0]?.data.count;

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  const drepDelegationColumns: TableColumns<DrepDelegationData> = useMemo(
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
        key: "drep",
        render: item => {
          if (!item.drep?.live?.id) {
            return <span>-</span>;
          }

          const drepItem = {
            data: item.drep.live.meta
              ? {
                  given_name: item.drep.live.meta.given_name,
                  image_url: item.drep.live.meta.image_url ?? undefined,
                }
              : undefined,
            hash: {
              view: item.drep.live.id,
            },
          };

          return <DrepNameCell item={drepItem} />;
        },
        jsonFormat: item => {
          if (!item.drep?.live?.id) {
            return "-";
          }

          const id = item.drep.live.id;
          const name = item.drep.live.meta?.given_name;

          return name || id;
        },
        title: t("stake.detailPage.drepDelegationsTable.drep"),
        visible: columnsVisibility.drep,
        widthPx: 110,
      },
      {
        key: "active_stake",
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
        visible: columnsVisibility.active_stake,
        widthPx: 60,
      },
      {
        key: "live_stake",
        render: item => (
          <div className='flex flex-col items-end gap-1/2'>
            <AdaWithTooltip data={item?.live_stake ?? 0} />
          </div>
        ),
        title: (
          <div className='flex w-full justify-end'>
            <span>{t("common:labels.liveStake")}</span>
          </div>
        ),
        visible: columnsVisibility.live_stake,
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

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between gap-1'>
          <h3 className='my-2'>{t("stake.detailPage.drepDelegationsTable.delegationHistory")}</h3>
          <div className='flex items-center gap-1'>
            <ExportButton columns={drepDelegationColumns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={accountDrepDelegationsTableOptions.map(item => {
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
          query={drepDelegationQuery}
          items={items}
          columns={drepDelegationColumns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof DrepDelegationsColumns) -
              columnsOrder.indexOf(b.key as keyof DrepDelegationsColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
    </section>
  );
};
