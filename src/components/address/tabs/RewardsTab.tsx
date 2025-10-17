import type { AddressDetailRewardsTableColumns } from "@/types/tableTypes";
import { Download } from "lucide-react";
import { useEffect, useState, type FC } from "react";

import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";

import { useFetchAccountRewards } from "@/services/account";
import { useAddressDetailRewardsTableStore } from "@/stores/tables/addressDetailRewardsTableStore";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import PoolCell from "@/components/table/PoolCell";
import { colors } from "@/constants/colors";
import { EPOCH_LENGTH_DAYS } from "@/constants/confVariables";
import { addressDetailRewardsTableOptions } from "@/constants/tables/addressDetailRewardsTableOptions";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useSearch } from "@tanstack/react-router";
import { RewardsGraph } from "../graphs/RewardsGraph";

interface RewardsTabProps {
  stakeAddress: string;
  parentPage: "stake" | "addr" | "rewardsChecker";
}

export const RewardsTab: FC<RewardsTabProps> = ({
  stakeAddress,
  parentPage,
}) => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({
    from:
      parentPage === "rewardsChecker"
        ? "/rewards-checker/"
        : parentPage === "stake"
          ? "/stake/$stakeAddr"
          : "/address/$address",
  });
  const {
    rows,
    columnsVisibility,
    columnsOrder,
    setRows,
    setColumnVisibility,
    setColumsOrder,
  } = useAddressDetailRewardsTableStore();

  const rewardsQuery = useFetchAccountRewards(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    stakeAddress,
  );

  const data = rewardsQuery.data?.pages.flatMap(page => page.data);
  const totalCount = rewardsQuery.data?.pages[0].count;

  const [totalItems, setTotalItems] = useState(0);

  const stake = (data || []).map(item => item?.account.epoch_stake);

  const columns = [
    {
      key: "epoch",
      render: item => <p>{item?.earned_epoch ?? 0}</p>,
      title: <p>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 50,
    },
    {
      key: "date",
      render: item => (
        <DateCell time={item?.spendable_epoch?.start_time ?? ""} />
      ),
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "stake_pool",
      render: item => <PoolCell poolInfo={item.pool} />,
      title: "Stake Pool",
      visible: columnsVisibility.stake_pool,
      widthPx: 50,
    },
    {
      key: "active_stake",
      render: item => (
        <span className='flex justify-end'>
          <AdaWithTooltip data={item?.account?.epoch_stake ?? 0} />
        </span>
      ),
      title: <p className='w-full text-right'>Active Stake</p>,
      visible: columnsVisibility.active_stake,
      widthPx: 50,
    },
    {
      key: "reward",
      render: item => (
        <span className='flex justify-end'>
          <AdaWithTooltip data={item?.amount ?? 0} />
        </span>
      ),
      title: <p className='w-full text-right'>Reward</p>,
      visible: columnsVisibility.reward,
      widthPx: 50,
    },
    {
      key: "roa",
      render: item => (
        <p className='text-right'>
          {(
            ((item.amount * 365.25) /
              EPOCH_LENGTH_DAYS /
              item.account.epoch_stake) *
            100
          ).toFixed(2)}
          %
        </p>
      ),
      title: <p className='w-full text-right'>Roa</p>,
      visible: columnsVisibility.roa,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <div className='flex flex-col gap-1.5'>
      {stake.length > 0 && <RewardsGraph data={data} />}
      <div
        className={`flex w-full items-center ${rewardsQuery.isError || !(data ?? []).length ? "justify-end" : "justify-between"} gap-1 md:flex-nowrap`}
      >
        {rewardsQuery.isError ? (
          <></>
        ) : !(data ?? []).length ? (
          <></>
        ) : rewardsQuery.isLoading ? (
          <LoadingSkeleton height='27px' width={"220px"} />
        ) : (
          <h3 className='basis-[230px] text-nowrap'>
            Total of {totalItems} rewards
          </h3>
        )}
        <div className='flex items-center gap-1'>
          <div className='flex h-[40px] w-fit shrink-0 items-center justify-center gap-1/2 rounded-s border border-border px-1.5'>
            <Download size={20} color={colors.text} />
            <span className='text-text-sm font-medium'>Export</span>
          </div>
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={addressDetailRewardsTableOptions.map(item => {
              return {
                label: item.name,
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
        scrollable
        totalItems={totalItems}
        currentPage={page ?? 1}
        itemsPerPage={rows}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof AddressDetailRewardsTableColumns,
            ) -
            columnsOrder.indexOf(
              b.key as keyof AddressDetailRewardsTableColumns,
            )
          );
        })}
        query={rewardsQuery}
        items={data}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
