import type { FC } from "react";
import type { PoolPefomanceColumns } from "@/types/tableTypes";

import ExportButton from "../table/ExportButton";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";

import { useFetchPoolDetail } from "@/services/pools";
import { usePoolPerfomanceTableStore } from "@/stores/tables/poolPerfomanceTableStore";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useState, useEffect } from "react";

import { poolPerfomanceTableOptions } from "@/constants/tables/poolPerfomanceTableOptions";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { useElapsedEpochNumber } from "@/hooks/useElapsedEpochNumber";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";

interface PoolPerfomanceTableProps {
  poolId: string;
}

export const PoolPerfomanceTable: FC<PoolPerfomanceTableProps> = ({
  poolId,
}) => {
  const query = useFetchPoolDetail(
    poolId.startsWith("pool1") ? poolId : undefined,
    poolId.startsWith("pool1") ? undefined : poolId,
  );

  const data = query?.data?.data;

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = usePoolPerfomanceTableStore();

  const epochElapsed = useElapsedEpochNumber(miscConst);

  const proratedLuck = data?.epochs[0].data.block
    ? (() => {
        const percent =
          (data?.blocks?.epoch ?? 0) /
          data?.epochs[0]?.data?.block?.estimated /
          epochElapsed;

        return Number.isNaN(percent) ? "-" : percent;
      })()
    : "-";

  const detailedData = [
    {
      no: (data?.epochs[0]?.no ?? 0) + 1,
      data: {
        delegators: data?.delegators,
        epoch_stake: data?.live_stake,
        block: {
          luck: proratedLuck,
          minted: data?.blocks?.epoch,
        },
        reward: {
          member_pct: 0,
        },
        pledged: data?.pledged,
      },
    },
    ...(query.data?.data?.epochs ?? []),
  ];

  const allItems = (detailedData ?? []).map(item => ({
    epoch: item.no,
    activeStake: item.data.epoch_stake,
    blocks: item.data.block.minted,
    delegators: item.data.delegators,
    luck: item?.data?.block?.luck ? item?.data?.block?.luck : "0",
    pledged: item.data.pledged,
    roa: item.data.reward.member_pct,
  }));

  const totalItems = allItems.length;

  const { startTime: firstEpochStartTime } = calculateEpochTimeByNumber(
    allItems[0]?.epoch,
    miscConst?.epoch.no ?? 0,
    miscConst?.epoch.start_time ?? "",
  );

  const { epochLength } = configJSON.genesisParams[0].shelley[0];

  const endTime = new Date(firstEpochStartTime).getTime() + epochLength * 1000;

  const durationInSeconds =
    (endTime - new Date(firstEpochStartTime).getTime()) / 1000;
  const [timeLeft, setTimeLeft] = useState((endTime - Date.now()) / 1000);

  useEffect(() => {
    setTimeLeft((endTime - Date.now()) / 1000);
  }, [endTime]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const elapsedPercentage =
    ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

  const columns = [
    {
      key: "epoch",
      render: item => (
        <EpochCell
          no={item?.epoch}
          showPulseDot
          currentEpoch={miscConst?.epoch.no}
        />
      ),
      title: "Epoch",
      visible: columnsVisibility.epoch,
      widthPx: 55,
    },
    {
      key: "date_start",
      render: item => {
        if (!item?.epoch) {
          return "-";
        }

        const { startTime } = calculateEpochTimeByNumber(
          item?.epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const dateFromDataTime = new Date(startTime);

        return (
          <div className='flex flex-col'>
            <span>
              {!isNaN(dateFromDataTime.getTime())
                ? format(dateFromDataTime, "dd.MM.yyyy")
                : "-"}
            </span>
            <DateCell
              time={
                startTime && !isNaN(startTime.getTime())
                  ? startTime.toISOString()
                  : ""
              }
              withoutConvert
              className='text-text-xs text-grayTextPrimary'
            />
          </div>
        );
      },
      jsonFormat: item => {
        const { startTime } = calculateEpochTimeByNumber(
          item.epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        if (!startTime) {
          return "-";
        }

        return String(startTime);
      },
      title: "Start Time",
      visible: columnsVisibility.date_start,
      widthPx: 50,
    },
    {
      key: "date_end",
      render: item => {
        if (!item?.epoch) {
          return "-";
        }

        const { endTime } = calculateEpochTimeByNumber(
          item.epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        if (miscConst?.epoch?.no === item.epoch) {
          return (
            <div className='flex items-center gap-1.5'>
              <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
                <span
                  className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                  style={{
                    width: `${elapsedPercentage ? (elapsedPercentage > 100 ? 100 : elapsedPercentage) : 0}%`,
                  }}
                ></span>
              </div>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                {!isNaN(elapsedPercentage)
                  ? elapsedPercentage > 100
                    ? 100
                    : elapsedPercentage.toFixed(2)
                  : "?"}
                %
              </span>
            </div>
          );
        }

        const dateFromDataTime = new Date(endTime);

        return (
          <div className='flex flex-col'>
            <span>
              {!isNaN(dateFromDataTime.getTime())
                ? format(dateFromDataTime, "dd.MM.yyyy")
                : "-"}
            </span>
            <DateCell
              time={
                endTime && !isNaN(endTime.getTime())
                  ? endTime.toISOString()
                  : ""
              }
              withoutConvert
              className='text-text-xs text-grayTextPrimary'
            />
          </div>
        );
      },
      jsonFormat: item => {
        const { endTime } = calculateEpochTimeByNumber(
          item.epoch,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        if (!endTime) {
          return "-";
        }

        if (miscConst?.epoch?.no === item.epoch) {
          return "Epoch was not ended for now.";
        }

        return String(endTime);
      },
      title: "End Time",
      visible: columnsVisibility.date_end,
      widthPx: 80,
    },
    {
      key: "blocks",
      render: item => {
        if (!item?.blocks) {
          return <p className='text-right'>-</p>;
        }

        return <p className='text-right'>{formatNumber(item.blocks)}</p>;
      },
      title: <p className='w-full text-right'>Blocks</p>,
      visible: columnsVisibility.blocks,
      widthPx: 50,
    },
    {
      key: "active_stake",
      render: item => {
        if (!item?.activeStake) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.activeStake} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Epoch Stake</p>,
      visible: columnsVisibility.active_stake,
      widthPx: 50,
    },
    {
      key: "delegators",
      render: item => {
        if (!item?.delegators) {
          return <p className='text-right'>-</p>;
        }

        return <p className='text-right'>{formatNumber(item.delegators)}</p>;
      },
      title: <p className='w-full text-right'>Delegators</p>,
      visible: columnsVisibility.delegators,
      widthPx: 50,
    },
    {
      key: "luck",
      render: item => {
        const isLastEpoch = miscConst?.epoch_param?.epoch_no
          ? item.epoch === miscConst?.epoch_param?.epoch_no
          : false;

        if (isLastEpoch) {
          return (
            <div className='flex justify-end'>
              <Badge color='blue' className='ml-auto'>
                Current
              </Badge>
            </div>
          );
        }

        if (!item?.luck) {
          return <p className='text-right'>-</p>;
        }

        return <p className='text-right'>{(item.luck * 100)?.toFixed(2)}%</p>;
      },
      title: <p className='w-full text-right'>Luck</p>,
      visible: columnsVisibility.luck,
      widthPx: 50,
    },
    {
      key: "pledged",
      render: item => {
        if (!item?.pledged) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.pledged} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Pledged</p>,
      visible: columnsVisibility.pledged,
      widthPx: 50,
    },
    {
      key: "roa",
      render: item => {
        const isPending = miscConst?.epoch_param?.epoch_no
          ? item.epoch > miscConst?.epoch_param?.epoch_no - 2
          : true;

        if (isPending) {
          return (
            <div className='flex justify-end'>
              <Badge color='yellow' className='ml-auto'>
                Pending
              </Badge>
            </div>
          );
        }

        if (typeof item?.roa === "undefined") {
          return <p className='text-right'>-</p>;
        }

        if (item?.roa === null) {
          return <p className='text-right'>-</p>;
        }

        return <p className='text-right'>{item?.roa?.toFixed(2)}%</p>;
      },
      title: (
        <div className='flex w-full justify-end'>
          <Tooltip
            content={
              <div style={{ width: "150px" }}>
                ROA: Return on ADA — annualized return percentage for delegators
              </div>
            }
          >
            <span className='cursor-help'>ROA</span>
          </Tooltip>
        </div>
      ),
      visible: columnsVisibility.roa,
      widthPx: 50,
    },
  ];

  return (
    <>
      <div className='flex items-center gap-1'>
        <ExportButton columns={columns} items={allItems} />
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          columnsOptions={poolPerfomanceTableOptions.map(item => {
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
        type='default'
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={query}
        pagination={true}
        items={allItems}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof PoolPefomanceColumns) -
            columnsOrder.indexOf(b.key as keyof PoolPefomanceColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
