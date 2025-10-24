import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";
import type { MiscConstResponse } from "@/types/miscTypes";
import type {
  PoolDelegatorsResponse,
  PoolListSearchParams,
} from "@/types/poolTypes";
import type { PoolDelegatorsColumns } from "@/types/tableTypes";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { getColumnsSortOrder } from "@vellumlabs/cexplorer-sdk";
import { calculateLoyaltyDays, slotToDate } from "@/utils/slotToDate";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { MinMaxRange } from "../global/MinMaxRange";
import { SortArrow } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { ArrowRight } from "lucide-react";

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

interface Props {
  delegatorsQuery: UseInfiniteQueryResult<
    InfiniteData<
      PoolDelegatorsResponse & { prevOffset: number | undefined },
      unknown
    >,
    Error
  >;
  miscConst: MiscConstResponse["data"] | undefined;
  totalItems: number;
}

const PoolDelegatorsTable = ({
  miscConst,
  delegatorsQuery,
  totalItems,
}: Props) => {
  const navigate = useNavigate();
  const { page, sort, order } = useSearch({ from: "/pool/$id" });
  const { columnsVisibility, setColumsOrder, columnsOrder, rows } =
    usePoolDelegatorsTableStore();
  const items = delegatorsQuery.data?.pages.flatMap(page => page.data.data);

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
      widthPx: 20,
    },
    {
      key: "active_in",
      render: item => (
        <div className='flex flex-col items-end gap-1/2'>
          {item?.live_pool?.delegation?.tx?.active_epoch_no ?? "-"}
        </div>
      ),
      title: <p className='w-full text-right'>Active epoch</p>,
      visible: columnsVisibility.active_in,
      widthPx: 45,
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

        const isStake = item.view.includes("stake");

        return (
          <div className='flex items-center gap-1/2'>
            {icon && <img src={icon} alt='Icon' />}
            <Link
              className='text-primary'
              to={isStake ? "/stake/$stakeAddr" : "/address/$address"}
              params={
                isStake
                  ? { stakeAddr: item.view }
                  : { address: item.view || "" }
              }
            >
              {formatString(item.view, "longer")}
            </Link>
            <Copy copyText={item.view} />
          </div>
        );
      },
      title: "Address",
      visible: columnsVisibility.address,
      widthPx: 90,
    },
    {
      key: "amount",
      render: item => (
        <div className='flex flex-col items-end gap-1/2'>
          <AdaWithTooltip data={item?.live_stake ?? 0} />
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
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
      widthPx: 40,
    },
    {
      key: "loyalty",
      render: item => {
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
      title: (
        <div className='flex w-full justify-end'>
          <div
            className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
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
      widthPx: 20,
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
      widthPx: 40,
    },
    {
      key: "pool_delegation",
      render: item => {
        const previousPool = item?.previous_pool;
        const livePool = item?.live_pool;

        return (
          <div className='flex w-full items-center justify-between gap-3 pl-5 xl:pl-0'>
            <div className='flex min-w-[40%] items-center gap-1'>
              {previousPool?.id ? (
                <PoolCell
                  poolInfo={{
                    id: previousPool.id,
                    meta: previousPool.meta,
                  }}
                  poolImageUrl={generateImageUrl(
                    previousPool.id,
                    "ico",
                    "pool",
                  )}
                  fontSize='12px'
                />
              ) : (
                "-"
              )}
            </div>

            <ArrowRight size={15} className='w-[40px]' />

            <div className='flex min-w-[40%] items-center gap-1'>
              {livePool?.id ? (
                <PoolCell
                  poolInfo={{
                    id: livePool.id,
                    meta: livePool.meta,
                  }}
                  poolImageUrl={generateImageUrl(livePool.id, "ico", "pool")}
                  fontSize='12px'
                />
              ) : (
                "-"
              )}
            </div>
          </div>
        );
      },
      title: <p>Pool Delegation</p>,
      visible: columnsVisibility.pool_delegation,
      widthPx: 180,
    },
  ];

  const getOrder = (orderValue: PoolListSearchParams["order"]) => {
    return getColumnsSortOrder(sort) !== undefined || order !== orderValue
      ? orderValue
      : undefined;
  };

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

export default PoolDelegatorsTable;
