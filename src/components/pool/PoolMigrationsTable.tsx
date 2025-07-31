import { usePoolMigrationsTableStore } from "@/stores/tables/poolMigrationsTableStore";
import type { MiscConstResponse } from "@/types/miscTypes";
import type {
  PoolDelegatorsResponse,
  PoolListSearchParams,
} from "@/types/poolTypes";
import type { PoolDelegatorsColumns } from "@/types/tableTypes";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import Copy from "../global/Copy";
import { SortArrow } from "../global/SortArrow";
import DateCell from "../table/DateCell";
import GlobalTable from "../table/GlobalTable";

import { formatString } from "@/utils/format/format";
import { getColumnsSortOrder } from "@/utils/getColumnsSortOrder";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { format } from "date-fns";
import type { FC } from "react";
import { AdaWithTooltip } from "../global/AdaWithTooltip";

import Crab from "@/resources/images/icons/crab.svg";
import Dino from "@/resources/images/icons/dino.svg";
import Dolphin from "@/resources/images/icons/dolphin.svg";
import Fish from "@/resources/images/icons/fish.svg";
import Humpback from "@/resources/images/icons/humpback.svg";
import Plankton from "@/resources/images/icons/plankton.svg";
import Shark from "@/resources/images/icons/shark.svg";
import Shrimp from "@/resources/images/icons/shrimp.svg";
import Tuna from "@/resources/images/icons/tuna.svg";
import Whale from "@/resources/images/icons/whale.svg";

interface PoolMigrationsTableProps {
  miscConst: MiscConstResponse["data"] | undefined;
  delegatorsQuery: UseInfiniteQueryResult<
    InfiniteData<
      PoolDelegatorsResponse & { prevOffset: number | undefined },
      unknown
    >,
    Error
  >;
  totalItems: number;
}

export const PoolMigrationsTable: FC<PoolMigrationsTableProps> = ({
  miscConst,
  delegatorsQuery,
  totalItems,
}) => {
  const navigate = useNavigate();
  const { page, sort, order } = useSearch({ from: "/pool/$id" });

  const { columnsVisibility, setColumsOrder, columnsOrder, rows } =
    usePoolMigrationsTableStore();

  const getOrder = (orderValue: PoolListSearchParams["order"]) => {
    return getColumnsSortOrder(sort) !== undefined || order !== orderValue
      ? orderValue
      : undefined;
  };

  const getIconByAmount = (amount: number) => {
    switch (true) {
      case amount < 10:
        return Plankton;
      case amount <= 10 && amount < 1000:
        return Shrimp;
      case amount <= 1000 && amount < 5000:
        return Crab;
      case amount <= 5000 && amount < 25000:
        return Fish;
      case amount <= 25000 && amount < 100000:
        return Dolphin;
      case amount <= 100000 && amount < 250000:
        return Shark;
      case amount <= 250000 && amount < 1e6:
        return Whale;
      case amount <= 1e6 && amount < 5e6:
        return Tuna;
      case amount <= 5e6 && amount < 20e6:
        return Humpback;
      case amount >= 20e6:
        return Dino;
      default:
        return undefined;
    }
  };

  const columns = [
    {
      key: "date",
      render: item => {
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
      title: <p>Date</p>,
      visible: columnsVisibility.date,
      widthPx: 80,
    },
    {
      key: "active_in",
      render: item => (
        <div className='flex flex-col items-end gap-1'>
          {item?.active_pool?.delegation?.tx?.active_epoch_no ?? ""}
        </div>
      ),
      title: <p className='w-full text-right'>Active epoch</p>,
      visible: columnsVisibility.active_in,
      widthPx: 50,
    },
    {
      key: "address",
      render: item => {
        if (!item.view) {
          return "-";
        }

        const icon = item?.live_stake
          ? getIconByAmount(item?.live_stake / 1e6)
          : undefined;

        return (
          <div className='flex items-center gap-1'>
            {icon && <img src={icon} alt='Icon' />}
            <Link
              className='text-primary'
              to='/address/$address'
              params={{ address: item.view || "" }}
            >
              {formatString(item.view, "longer")}
            </Link>
            <Copy copyText={item.view} />
          </div>
        );
      },
      title: "Address",
      visible: columnsVisibility.address,
      widthPx: 80,
    },
    {
      key: "amount",
      rankingStart: order === "live_stake" ? sort : undefined,
      render: item => (
        <div className='flex flex-col items-end gap-1'>
          <AdaWithTooltip data={item?.live_stake ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1 text-right'
            onClick={() => {
              navigate({
                search: {
                  sort:
                    order === "live_stake" ? getColumnsSortOrder(sort) : "desc",
                  order: getOrder("live_stake"),
                } as any,
              });
            }}
          >
            <span>Amount</span>
            <SortArrow direction={order === "live_stake" ? sort : undefined} />
          </div>
        </div>
      ),
      visible: columnsVisibility.amount,
      widthPx: 80,
    },
    {
      key: "loyalty",
      render: item => (
        <p className='text-right'>
          {calculateLoyaltyDays(
            item.slot_update,
            miscConst?.epoch_stat?.pots?.slot_no ?? 0,
          )}
          d
        </p>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1 text-right'
            onClick={() => {
              navigate({
                search: {
                  sort:
                    order === "slot_update"
                      ? getColumnsSortOrder(sort)
                      : "desc",
                  order: getOrder("slot_update"),
                } as any,
              });
            }}
          >
            <span>Loyalty</span>
            <SortArrow direction={order === "slot_update" ? sort : undefined} />
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
                item.slot_update,
                miscConst?.epoch_stat.pots.slot_no ?? 0,
                miscConst?.epoch_stat.epoch.start_time ?? "",
              ),
              "yyy-MM-dd HH:mm:ss",
            )}
          />
        );
      },
      title: <p className='w-full text-right'>Registered</p>,
      visible: columnsVisibility.registered,
      widthPx: 80,
    },
  ];

  const items = delegatorsQuery.data?.pages.flatMap(page => page.data.data);

  return (
    <GlobalTable
      type='infinite'
      currentPage={page ?? 1}
      totalItems={totalItems}
      itemsPerPage={rows}
      rowHeight={69}
      scrollable
      query={delegatorsQuery}
      items={items}
      columns={columns.sort((a, b) => {
        return (
          columnsOrder.indexOf(a.key as keyof PoolDelegatorsColumns) -
          columnsOrder.indexOf(b.key as keyof PoolDelegatorsColumns)
        );
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
