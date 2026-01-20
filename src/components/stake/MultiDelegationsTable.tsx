import { useMemo, type FC } from "react";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import { useFetchDelegationsState } from "@/services/delegations";
import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";
import type { DelegationStateData } from "@/types/delegationTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { PoolDelegatorsColumns, TableColumns } from "@/types/tableTypes";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface MultiDelegationsTableProps {
  address: string;
  miscConst: MiscConstResponseData | undefined;
}

export const MultiDelegationsTable: FC<MultiDelegationsTableProps> = ({
  address,
  miscConst,
}) => {
  const { t } = useAppTranslation("pages");
  const { columnsVisibility, setColumsOrder, columnsOrder } =
    usePoolDelegatorsTableStore();

  const delegationStateQuery = useFetchDelegationsState(address);

  const delegationStateColumns: TableColumns<DelegationStateData> = useMemo(
    () => [
      {
        key: "date",
        render: item => {
          return (
            <Link
              to='/stake/$stakeAddr'
              params={{ stakeAddr: item.view }}
              className='text-primary'
            >
              {formatString(item.view, "longer")}
            </Link>
          );
        },
        title: <p>{t("common:labels.address")}</p>,
        visible: columnsVisibility.date,
        widthPx: 80,
      },
      {
        key: "active_in",
        render: item => (
          <div className='flex flex-col items-end gap-1/2'>
            {item?.delegation.active.active_epoch_no ?? "-"}
          </div>
        ),
        title: (
          <p className='w-full text-right'>
            {t("stake.detailPage.multiDelegationsTable.activeEpoch")}
          </p>
        ),
        visible: columnsVisibility.active_in,
        widthPx: 50,
      },
      {
        key: "address",
        render: item => (
          <div className='flex items-center gap-1/2'>
            {item.delegation?.live?.pool?.id ? (
              <PoolCell
                poolInfo={item.delegation.live.pool}
                poolImageUrl={generateImageUrl(
                  item.delegation.live.pool.id,
                  "ico",
                  "pool",
                )}
              />
            ) : (
              <Badge color='yellow'>
                {t("stake.detailPage.multiDelegationsTable.notDelegated")}
              </Badge>
            )}
          </div>
        ),
        title: t("stake.detailPage.multiDelegationsTable.stakePool"),
        visible: columnsVisibility.address,
        widthPx: 110,
      },
      {
        key: "amount",
        render: item => (
          <div className='flex flex-col items-end gap-1/2'>
            <AdaWithTooltip data={item?.stake?.active[0]?.amount ?? 0} />
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
        render: item => (
          <p className='text-right'>
            {calculateLoyaltyDays(
              item.delegation.active.slot_no,
              miscConst?.epoch_stat?.pots?.slot_no ?? 0,
            )}
            d
          </p>
        ),
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
              className=''
              time={format(
                slotToDate(
                  item.delegation.active.slot_no,
                  miscConst?.epoch_stat.pots.slot_no ?? 0,
                  miscConst?.epoch_stat.epoch.start_time ?? "",
                ),
                "yyy-MM-dd HH:mm:ss",
              )}
            />
          );
        },
        title: <p className=''>{t("common:labels.registered")}</p>,
        visible: columnsVisibility.registered,
        widthPx: 80,
      },
    ],
    [columnsVisibility, miscConst, t],
  );

  if (
    !delegationStateQuery.data?.count ||
    delegationStateQuery.data?.count <= 1
  ) {
    return null;
  }

  console.log(
    "delegationStateQuery.data?.data",
    delegationStateQuery.data?.data,
  );

  return (
    <div>
      <h3 className='mb-2 flex items-center gap-1'>
        {t("stake.detailPage.multiDelegationsTable.title")}
      </h3>
      <GlobalTable
        type='default'
        pagination
        totalItems={delegationStateQuery.data?.data.length}
        itemsPerPage={10}
        rowHeight={60}
        scrollable
        query={delegationStateQuery}
        items={delegationStateQuery.data?.data}
        columns={delegationStateColumns.sort((a, b) => {
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
  );
};
