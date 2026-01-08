import { activeSlotsCoeff, epochLength } from "@/constants/confVariables";
import { poolRewardsTableOptions } from "@/constants/tables/poolRewardsTableOptions";
import { useElapsedEpochNumber } from "@/hooks/useElapsedEpochNumber";
import { useFetchPoolDetail, useFetchPoolReward } from "@/services/pools";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { usePoolRewardsTableStore } from "@/stores/tables/poolRewardsTableStore";
import type { MiscConstResponse } from "@/types/miscTypes";
import type { PoolRewardsColumns } from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useSearch } from "@tanstack/react-router";
import { Network, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "../table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  poolId: string;
  miscConst: MiscConstResponse["data"] | undefined;
  currentActiveStake?: number;
  currentEpochStake?: number;
}

const PoolRewardsTable = ({
  poolId,
  miscConst,
  currentActiveStake,
  currentEpochStake,
}: Props) => {
  const { t } = useAppTranslation("pages");
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/pool/$id" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolRewardsTableStore();
  const [totalItems, setTotalItems] = useState(0);
  const detailQuery = useFetchPoolDetail(poolId, "");
  const poolRewardsQuery = useFetchPoolReward(
    poolId,
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
  );
  const estimatedBlocks =
    ((epochLength *
      activeSlotsCoeff *
      (1 - (miscConst?.epoch_param?.decentralisation ?? 0))) /
      (miscConst?.epoch_stat.stake.active ?? 1)) *
    (detailQuery.data?.data?.active_stake ?? 1);
  const epochElapsed = useElapsedEpochNumber(miscConst);

  const proratedLuck = detailQuery.data?.data?.epochs[0].data.block && estimatedBlocks > 0
    ? (() => {
        const percent =
          ((detailQuery.data?.data?.blocks?.epoch || 0) /
            estimatedBlocks /
            epochElapsed) *
          100;

        return Number.isNaN(percent) ? "-" : percent.toFixed(2) + "%";
      })()
    : "-";

  const totalCount = poolRewardsQuery.data?.pages[0].data.count;
  const items = poolRewardsQuery.data?.pages.flatMap(page => page.data.data);
  const currentEpoch = miscConst?.no;

  const columns = [
    {
      key: "epoch",
      render: item => (
        <EpochCell no={item.no} showPulseDot currentEpoch={miscConst?.no} />
      ),
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.epoch")}</p>,
      visible: columnsVisibility.epoch,
      widthPx: 30,
    },
    {
      key: "rewards",
      render: item => (
        <>
          {currentEpoch === item.no ? (
            <PendingTag text={t("pools.detailPage.rewardsTable.pendingTwoEpochs")} pendingLabel={t("pools.detailPage.rewardsTable.pending")} />
          ) : currentEpoch && currentEpoch - 1 === item.no ? (
            <PendingTag text={t("pools.detailPage.rewardsTable.pendingNextEpoch")} pendingLabel={t("pools.detailPage.rewardsTable.pending")} />
          ) : (
            <div className='flex flex-col items-end gap-1/2'>
              <p className='flex items-center gap-1/2'>
                <AdaWithTooltip data={item.reward?.leader_lovelace ?? 0} />
                <Tooltip content={t("pools.detailPage.rewardsTable.poolOperatorRewards")}>
                  <Network size={16} className='cursor-help' />
                </Tooltip>
              </p>
              <p className='flex items-center gap-1/2'>
                <AdaWithTooltip data={item.reward?.member_lovelace ?? 0} />
                <Tooltip content={t("pools.detailPage.rewardsTable.delegatorRewards")}>
                  <Users size={16} className='cursor-help' />
                </Tooltip>
              </p>
            </div>
          )}
        </>
      ),
      jsonFormat: item => {
        if (currentEpoch === item.no) {
          return "The data will be available two epochs later.";
        }

        if (currentEpoch && currentEpoch - 1 === item.no) {
          return "The data will be available next epoch.";
        }

        return `${lovelaceToAda(item.reward?.leader_lovelace ?? 0)} ${lovelaceToAda(item.reward?.member_lovelace ?? 0)}`;
      },
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.rewards")}</p>,
      visible: columnsVisibility.rewards,
      widthPx: 50,
    },
    {
      key: "active_stake",
      render: item => {
        if (miscConst?.no === item.no) {
          return (
            <div className='flex w-full flex-col items-end gap-1/2'>
              <p className='text-greyText'>
                <AdaWithTooltip data={currentActiveStake ?? 0} />
              </p>
            </div>
          );
        }

        return (
          <div className='flex w-full flex-col items-end gap-1/2'>
            <p className='text-grayTextPrimary'>
              <AdaWithTooltip data={item.active_stake ?? 0} />
            </p>
          </div>
        );
      },
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.activeStake")}</p>,
      visible: columnsVisibility.active_stake,
      widthPx: 50,
    },
    {
      key: "epoch_stake",
      render: item => {
        if (miscConst?.no === item.no) {
          return (
            <div className='flex flex-col items-end gap-1/2'>
              <p className='text-right'>
                <AdaWithTooltip data={currentEpochStake ?? 0} />
              </p>
            </div>
          );
        }

        return (
          <div className='flex flex-col items-end gap-1/2'>
            <p className='text-right text-grayTextPrimary'>
              <AdaWithTooltip data={item?.epoch_stake ?? 0} />
            </p>
          </div>
        );
      },
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.epochStake")}</p>,
      visible: columnsVisibility.epoch_stake,
      widthPx: 50,
    },
    {
      key: "roa",
      render: item => (
        <div className='text-right'>
          {currentEpoch === item.no ? (
            <PendingTag text={t("pools.detailPage.rewardsTable.pendingTwoEpochs")} pendingLabel={t("pools.detailPage.rewardsTable.pending")} />
          ) : currentEpoch && currentEpoch - 1 === item.no ? (
            <PendingTag text={t("pools.detailPage.rewardsTable.pendingNextEpoch")} pendingLabel={t("pools.detailPage.rewardsTable.pending")} />
          ) : item.reward?.member_pct ? (
            item.reward.member_pct.toFixed(2) + "%"
          ) : (
            "0.00%"
          )}
        </div>
      ),
      title: (
        <div className='flex w-full justify-end'>
          <Tooltip
            content={
              <div style={{ width: "150px" }}>
                {t("pools.detailPage.rewardsTable.roaTooltip")}
              </div>
            }
          >
            <span className='cursor-help'>{t("pools.detailPage.rewardsTable.roa")}</span>
          </Tooltip>
        </div>
      ),
      visible: columnsVisibility.roa,
      widthPx: 30,
    },
    {
      key: "luck",
      render: item => (
        <div className='text-right'>
          {currentEpoch === item.no ? (
            <div className='flex items-center justify-end gap-1/2'>
              <Tooltip
                content={
                  <p className='w-36 text-center'>{t("pools.detailPage.rewardsTable.proratedLuckTooltip")}</p>
                }
              >
                <QuestionMarkCircledIcon />
              </Tooltip>
              {proratedLuck}
            </div>
          ) : (
            <>
              {(() => {
                const luck = (item.block?.luck ?? 0) * 100;
                if (!isFinite(luck)) return "-";
                return luck.toFixed(1) + "%";
              })()}
            </>
          )}
        </div>
      ),
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.luck")}</p>,
      visible: columnsVisibility.luck,
      widthPx: 30,
    },
    {
      key: "blocks",
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.blocks")}</p>,
      render: item => (
        <div className='text-right'>
          {currentEpoch === item.no
            ? `${formatNumber(detailQuery.data?.data?.blocks?.epoch)} / ${formatNumber(estimatedBlocks.toFixed(2))}`
            : `${formatNumber(item.block?.minted ?? 0)} / ${formatNumber(item.block?.estimated?.toFixed(2))}`}
        </div>
      ),
      visible: columnsVisibility.blocks,
      widthPx: 55,
    },
    {
      key: "delegators",
      title: <p className='w-full text-right'>{t("pools.detailPage.rewardsTable.delegators")}</p>,
      render: item => (
        <div className='text-right'>
          {currentEpoch === item.no
            ? detailQuery.data?.data.delegators
            : item.delegator}
        </div>
      ),
      visible: columnsVisibility.delegators,
      widthPx: 35,
    },
  ];

  useEffect(() => {
    if (totalCount && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  return (
    <>
      <div className='flex items-center gap-1'>
        <ExportButton columns={columns} items={items} />
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          columnsOptions={poolRewardsTableOptions.map(item => {
            return {
              label: item.name,
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            };
          })}
        />
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        rowHeight={69}
        scrollable
        query={poolRewardsQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof PoolRewardsColumns) -
            columnsOrder.indexOf(b.key as keyof PoolRewardsColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};

export default PoolRewardsTable;

const PendingTag = ({ text, pendingLabel }: { text: string; pendingLabel?: string }) => {
  return (
    <Badge color='yellow' className='ml-auto'>
      <Tooltip
        content={<div className='w-36 text-center text-text'>{text}</div>}
      >
        <QuestionMarkCircledIcon />
      </Tooltip>
      {pendingLabel || "Pending"}
    </Badge>
  );
};
