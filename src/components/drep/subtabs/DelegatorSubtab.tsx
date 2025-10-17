import type { DelegatorData } from "@/types/drepTypes";
import type {
  DrepDelegatorTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { Copy } from "@vellumlabs/cexplorer-sdk";
import { MinMaxRange } from "@/components/global/MinMaxRange";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchDrepDelegator } from "@/services/drep";
import { useFetchMiscBasic } from "@/services/misc";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useDrepDelegatorTableStore } from "@/stores/tables/drepDelegatorTableStore";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { formatString } from "@/utils/format/format";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { DrepNameCell } from "../DrepNameCell";

interface DelegatorSubtabProps {
  type: "all" | "new" | "migrations";
  view: string;
}

export const DelegatorSubtab: FC<DelegatorSubtabProps> = ({ type, view }) => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/drep/$hash" });

  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    // setColumnVisibility,
    rows,
    // setRows,
  } = useDrepDelegatorTableStore();

  const fetchParams = {
    filter: "live",
    order: "live_stake",
  } as {
    filter: "live" | "migrations";
    order: "live_stake" | "slot_update";
  };

  if (type === "new") {
    fetchParams["order"] = "slot_update";
  }

  if (type === "migrations") {
    fetchParams["order"] = "slot_update";
    fetchParams["filter"] = "migrations";
  }

  const delegatorQuery = useFetchDrepDelegator(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    view,
    fetchParams.filter,
    fetchParams.order,
  );

  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);

  const totalDelegators = delegatorQuery.data?.pages[0].data.count;
  const items = delegatorQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<DelegatorData> = [
    {
      key: "date",
      render: item => {
        if (!item?.slot_update) {
          return "-";
        }

        return (
          <DateCell
            time={format(
              slotToDate(
                item.slot_update,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      title: <p>Delegated</p>,
      visible: columnsVisibility.date,
      widthPx: 30,
    },
    {
      key: "active_in",
      render: item => {
        if (!item?.live_drep?.tx?.epoch_no) {
          return "-";
        }

        return <p className='text-right'>{item?.live_drep?.tx?.epoch_no}</p>;
      },
      title: <p className='w-full text-right'>Active In</p>,
      visible: columnsVisibility.active_in,
      widthPx: 30,
    },
    {
      key: "stake",
      render: item => {
        if (!item?.view) {
          return "-";
        }

        return (
          <div className='flex items-center gap-1'>
            <Link
              to='/stake/$stakeAddr'
              params={{
                stakeAddr: item.view,
              }}
              className='text-primary'
            >
              {formatString(item?.view, "long")}
            </Link>
            <Copy copyText={item?.view} className='translate-y-[2px]' />
          </div>
        );
      },
      title: <p>Stake</p>,
      visible: columnsVisibility.stake,
      widthPx: 70,
    },
    {
      key: "amount",
      render: item => {
        if (!item?.live_stake) {
          return "-";
        }

        return (
          <p className='w-full text-right'>
            <AdaWithTooltip data={item.live_stake} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Amount</p>,
      visible: columnsVisibility.amount,
      widthPx: 30,
    },
    {
      key: "drep_delegation",
      render: item => {
        const previousDrep = item?.previous_drep;
        const liveDrep = item?.live_drep;

        return (
          <div className='flex w-full min-w-[120px] items-center justify-between gap-1'>
            <div className='flex min-w-[40%] items-center gap-1'>
              {previousDrep?.id ? (
                <DrepNameCell
                  item={{
                    hash: { view: previousDrep.id },
                    data: {
                      given_name: previousDrep?.data?.given_name,
                      image_url: previousDrep?.data?.image_url,
                    },
                  }}
                />
              ) : (
                "-"
              )}
            </div>

            <ArrowRight size={15} />

            <div className='flex min-w-[40%] items-center gap-1'>
              {liveDrep?.id ? (
                <DrepNameCell
                  item={{
                    hash: { view: liveDrep.id },
                    data: {
                      given_name: liveDrep?.data?.given_name,
                      image_url: liveDrep?.data?.image_url,
                    },
                  }}
                />
              ) : (
                "-"
              )}
            </div>
          </div>
        );
      },
      title: <p>DRep Delegation</p>,
      visible: columnsVisibility.drep_delegation,
      widthPx: 140,
    },
    {
      key: "loyalty",
      render: item => {
        if (!item?.slot_update) {
          return "-";
        }

        const loyaltyDays = calculateLoyaltyDays(
          item.slot_update,
          miscConst?.epoch_stat?.pots?.slot_no ?? 0,
        );

        return (
          <div className='flex justify-end'>
            <MinMaxRange
              min={0}
              max={365}
              current={`${loyaltyDays}d`}
              size='sm'
              labelPosition='above'
            />
          </div>
        );
      },
      title: <p className='w-full text-right'>Loyalty</p>,
      visible: columnsVisibility.loyalty,
      widthPx: 20,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.live_drep?.tx?.tx_hash) {
          return "-";
        }

        return <HashCell hash={item?.live_drep?.tx?.tx_hash} />;
      },
      title: <p>Tx</p>,
      visible: columnsVisibility.tx,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalDelegators && totalDelegators !== totalItems) {
      setTotalItems(totalDelegators);
    }
  }, [totalDelegators, totalItems]);

  return (
    <GlobalTable
      type='infinite'
      currentPage={page ?? 1}
      totalItems={totalItems}
      itemsPerPage={rows}
      scrollable
      query={delegatorQuery}
      items={items}
      minContentWidth={1300}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof DrepDelegatorTableColumns) -
          columnsOrder.indexOf(b.key as keyof DrepDelegatorTableColumns)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
