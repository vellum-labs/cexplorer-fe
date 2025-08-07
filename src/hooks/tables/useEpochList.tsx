import type { EpochListColumns } from "@/types/tableTypes";
import type { EpochListData } from "@/types/epochTypes";
import type { Dispatch, SetStateAction } from "react";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import PulseDot from "@/components/global/PulseDot";
import DateCell from "@/components/table/DateCell";
import ReactEcharts from "echarts-for-react";

import { currencySigns } from "@/constants/currencies";
import { convertUtcToLocal } from "@/utils/convertUtcToLocal";
import { formatNumber, formatNumberWithSuffix } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

import { useFetchEpochList } from "@/services/epoch";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useEpochListTableStore } from "@/stores/tables/epochListTableStore";
import { useEffect, useState } from "react";
import { useGetMarketCurrency } from "../useGetMarketCurrency";
import { Badge } from "@/components/global/badges/Badge";
import { useGraphColors } from "../useGraphColors";
import { useSearchTable } from "./useSearchTable";

interface UseEpochList {
  columns: any[];
  epochListQuery: ReturnType<typeof useFetchEpochList>;
  tableSearch: string;
  setTableSearch: Dispatch<SetStateAction<string>>;
  filteredData: EpochListData[];
  columnsVisibility: EpochListColumns;
  setColumnVisibility: (storeKey: string, isVisible: boolean) => void;
}

interface UseEpochListArgs {
  data: EpochListData[];
  epoch_number: number;
  storeKey?: string;
  withoutRerender?: boolean;
}

export const useEpochList = ({
  data,
  epoch_number,
  storeKey,
  withoutRerender = false,
}: UseEpochListArgs): UseEpochList => {
  const { currency } = useCurrencyStore();

  const curr = useGetMarketCurrency();

  const { bgColor, textColor } = useGraphColors();

  const filteredData = data.filter(item => item?.start_time);

  const endTime = new Date(filteredData[0]?.start_time).getTime() + 432000000;

  const durationInSeconds =
    (endTime - new Date(filteredData[0]?.start_time).getTime()) / 1000;
  const [timeLeft, setTimeLeft] = useState((endTime - Date.now()) / 1000);

  useEffect(() => {
    setTimeLeft((endTime - Date.now()) / 1000);
  }, [endTime]);

  useEffect(() => {
    if (timeLeft > 0 && !withoutRerender) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, withoutRerender]);

  const elapsedPercentage =
    ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

  const [{ tableSearch }, setTableSearch] = useSearchTable();

  const { columnsVisibility, setColumnVisibility } =
    useEpochListTableStore(storeKey)();

  const epochListQuery = useFetchEpochList();

  const columns = [
    {
      key: "start_time",
      render: item => {
        const localDate = convertUtcToLocal(item?.start_time);
        const dateFromDataTime = new Date(localDate.replace(" ", "T"));

        return (
          <div className='flex flex-col'>
            <span> {format(dateFromDataTime, "dd.MM.yyyy")}</span>
            <DateCell
              time={item?.start_time}
              className='text-xs text-grayTextPrimary'
            />
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.start_time) {
          return "-";
        }

        return item.start_time;
      },
      title: "Start Time",
      visible: columnsVisibility.start_time,
      widthPx: 90,
    },
    {
      key: "end_time",
      render: item => {
        if (filteredData[0]?.end_time === item.end_time && !withoutRerender) {
          return (
            <div className='flex items-center gap-3'>
              <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
                <span
                  className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                  style={{
                    width: `${elapsedPercentage ? (elapsedPercentage > 100 ? 100 : elapsedPercentage) : 0}%`,
                  }}
                ></span>
              </div>
              <span className='text-sm font-medium text-grayTextPrimary'>
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

        const localDate = convertUtcToLocal(item?.end_time);
        const dateFromDataTime = new Date(localDate.replace(" ", "T"));

        return (
          <div className='flex flex-col'>
            <span> {format(dateFromDataTime, "dd.MM.yyyy")}</span>
            <DateCell
              time={item?.end_time}
              className='text-xs text-grayTextPrimary'
            />
          </div>
        );
      },
      jsonFormat: item => {
        if (!item.end_time) {
          return "-";
        }

        if (filteredData[0]?.end_time === item.end_time) {
          return "Epoch was not ended for now.";
        }

        return item.end_time;
      },
      title: "End Time",
      visible: columnsVisibility.end_time,
      widthPx: 90,
    },
    {
      key: "epoch",
      render: item => {
        const epochNo = item.params?.[0]?.epoch_no ?? item.no;
        return (
          <div className='relative'>
            <div className='absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              {+epoch_number - 1 === epochNo && <PulseDot />}
            </div>
            <p className='cursor-pointer pl-3 text-sm text-primary'>
              <Link
                to='/epoch/$no'
                params={{ no: String(epochNo) }}
                className='text-primary'
              >
                {epochNo}
              </Link>
            </p>
          </div>
        );
      },
      title: <p>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 50,
    },
    {
      key: "block",
      render: item => (
        <p title={item?.stats?.epoch?.block_count ?? item?.blk_count} className='text-right'>
          {formatNumber(item?.stats?.epoch?.block_count ?? item?.blk_count)}
        </p>
      ),
      title: <p className='w-full text-right'>Blocks</p>,
      visible: columnsVisibility.blocks,
      widthPx: 50,
    },
    {
      key: "txs",
      render: item => (
        <p title={item?.tx_count} className='text-right'>
          {formatNumber(item?.tx_count)}
        </p>
      ),
      title: <p className='w-full text-right'>TXs</p>,
      visible: columnsVisibility.txs,
      widthPx: 50,
    },
    {
      key: "outsum",
      render: item => (
        <p title={item?.out_sum} className='text-right'>
          <AdaWithTooltip data={item?.out_sum} />
        </p>
      ),
      title: <p className='w-full text-right'>Output</p>,
      visible: columnsVisibility.output,
      widthPx: 55,
    },
    {
      key: "fees",
      render: item => {
        const feesperTx = lovelaceToAda(
          isNaN(item?.fees / item.tx_count) ? 0 : item?.fees / item.tx_count,
        );

        return (
          <div title={item?.fees} className='flex flex-col'>
            <span>
              <AdaWithTooltip data={item?.fees ?? 0} />
            </span>
            <span>{feesperTx}/tx</span>
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.fees) {
          return "-";
        }

        const fees = lovelaceToAda(item?.fees);
        const feesperTx = lovelaceToAda(
          isNaN(item?.fees / item.tx_count) ? 0 : item?.fees / item.tx_count,
        );

        return `${fees}, ${feesperTx} per TX`;
      },
      title: "Fees",
      visible: columnsVisibility.fees,
      widthPx: 50,
    },
    {
      key: "rewards",
      render: item => {
        const epochNo = item.params?.[0]?.epoch_no ?? item.no;
        const isPending = epochNo >= epoch_number - 2;

        const leaderReward = item.stats?.rewards?.leader ?? 0;
        const [ada, usd] = lovelaceToAdaWithRates(
          leaderReward,
          curr,
        );

        if (isPending || leaderReward === null) {
          return (
            <div className='flex justify-end'>
              <Badge color='yellow' className='ml-auto'>
                Pending
              </Badge>
            </div>
          );
        }

        return (
          <div title={ada} className='text-right'>
            <AdaWithTooltip data={leaderReward} />
            <div className='flex w-full justify-end'>
              <Badge color='blue' className='text-nowrap'>
                {currencySigns[currency]} {formatNumberWithSuffix(usd)}
              </Badge>
            </div>
          </div>
        );
      },
      title: <p className='w-full text-right'>Rewards</p>,
      visible: columnsVisibility.rewards,
      widthPx: 50,
    },
    {
      key: "stake",
      render: item => {
        const stakeEpoch = item.stats?.stake?.epoch ?? 0;
        return (
          <p
            title={lovelaceToAda(stakeEpoch)}
            className='text-nowrap text-right'
          >
            <AdaWithTooltip data={stakeEpoch} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Stake</p>,
      visible: columnsVisibility.stake,
      widthPx: 50,
    },
    {
      key: "usage",
      render: item => {
        const blockSize = item?.stats?.epoch?.block_size ?? 0;
        const blockCount = item?.stats?.epoch?.block_count ?? item.blk_count ?? 0;
        const maxBlockSize = item.params?.[0]?.max_block_size ?? 0;
        const blockUsage = isNaN(
          (blockSize / (blockCount * maxBlockSize)) * 100,
        )
          ? 0
          : (blockSize / (blockCount * maxBlockSize)) * 100;

        const usagePercentage = blockUsage.toFixed(2);

        const option = {
          tooltip: {
            trigger: "item",
            backgroundColor: bgColor,
            confine: true,
            textStyle: {
              color: textColor,
            },
            formatter: param => {
              const marker = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${param.color};margin-right:5px;"></span>`;
              return `<div>${marker}${param.name}: ${Number(param.value).toFixed(2)}%</div>`;
            },
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: usagePercentage,
                  name: "Usage",
                  itemStyle: { color: "#47CD89" },
                },
                {
                  value: (100 - blockUsage).toFixed(2),
                  name: "Left",
                  itemStyle: { color: "#FEC84B" },
                },
              ],
            },
          ],
        };

        return (
          <div className='flex h-full w-full flex-col items-center justify-center'>
            <ReactEcharts option={option} className='max-h-[50px] w-[50px]' />
          </div>
        );
      },
      jsonFormat: item => {
        const blockSize = item?.stats?.epoch?.block_size ?? 0;
        const blockCount = item?.stats?.epoch?.block_count ?? item.blk_count ?? 0;
        const maxBlockSize = item.params?.[0]?.max_block_size ?? 0;
        const blockUsage = isNaN(
          (blockSize / (blockCount * maxBlockSize)) * 100,
        )
          ? 0
          : (blockSize / (blockCount * maxBlockSize)) * 100;

        const usagePercentage = blockUsage.toFixed(2);

        return `${usagePercentage}%`;
      },
      title: <p className='text-center'>Usage</p>,
      visible: columnsVisibility.usage,
      widthPx: 50,
    },
  ];

  return {
    columns,
    epochListQuery,
    filteredData,
    tableSearch,
    columnsVisibility,
    setColumnVisibility,
    setTableSearch,
  };
};
