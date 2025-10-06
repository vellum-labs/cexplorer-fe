import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "../../global/graphs/GraphWatermark";
import LoadingSkeleton from "../../global/skeletons/LoadingSkeleton";

import { useFetchEpochList } from "@/services/epoch";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect, useRef, useState } from "react";
import { useFetchEpochAnalytics } from "@/services/analytics";

import { formatNumber, formatNumberWithSuffix } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { useGraphColors } from "@/hooks/useGraphColors";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";

export const EpochAnalyticsTabItem: FC = () => {
  const { theme } = useThemeStore();
  const { bgColor, textColor } = useGraphColors();

  const [colorByTheme, setColorByTheme] = useState<string>(
    theme === "light" ? "black" : "white",
  );

  const { data, isLoading, isError } = useFetchEpochList();
  const { data: analyticsEpoch } = useFetchEpochAnalytics();

  const echartsRef = useRef<HTMLDivElement>(null);

  const filteredDataItems = (data?.data || []).filter(e => e);

  const filteredAnalyticsEpoch = (analyticsEpoch?.data || []).filter(item =>
    (filteredDataItems || []).find(dataItem => dataItem?.no === item?.no),
  );

  const analyticsData: {
    key: string;
    title: string;
    data: number[];
    epochs: number[];
    tooltipProcents?: boolean;
    changeLovelaceToAda?: boolean;
  }[] = [
    {
      key: "blocks",
      title: "Blocks",
      epochs: ([...filteredDataItems].reverse() || [])
        .filter(item => item.blk_count)
        .map(item => item.no),
      data: ([...filteredDataItems].reverse() || [])
        .filter(item => item.blk_count)
        .map(item => item.blk_count),
    },
    {
      key: "blocks_usage",
      title: "Block Usage",
      epochs: ([...filteredDataItems].reverse() || [])
        .filter(item => {
          return (
            item?.stats?.epoch?.block_size > 0 &&
            item?.blk_count > 0 &&
            item?.params?.[0]?.max_block_size > 0
          );
        })
        .map(item => item.no),
      data: ([...filteredDataItems].reverse() || [])
        .filter(
          item =>
            item?.stats?.epoch?.block_size > 0 &&
            item?.blk_count > 0 &&
            item?.params?.[0]?.max_block_size > 0,
        )
        .map(item => {
          const blockSize = item.stats.epoch?.block_size;
          const blockCount = item.blk_count;
          const maxBlockSize = item.params?.[0]?.max_block_size ?? 0;

          const blockUsage = isNaN(
            (blockSize / (blockCount * maxBlockSize)) * 100,
          )
            ? 0
            : (blockSize / (blockCount * maxBlockSize)) * 100;

          return blockUsage;
        }),
      tooltipProcents: true,
    },
    {
      key: "transactions",
      title: "Transactions",
      epochs: ([...filteredDataItems].reverse() || [])
        .filter(item => item?.tx_count)
        .map(item => item.no),
      data: ([...filteredDataItems].reverse() || [])
        .filter(item => item?.tx_count)
        .map(item => item.tx_count),
    },
    {
      key: "staked_ada",
      title: "Staked ADA",
      epochs: ([...filteredDataItems].reverse() || [])
        .filter(item => item.stats?.stake?.epoch)
        .map(item => item.no),
      data: ([...filteredDataItems].reverse() || [])
        .filter(item => item.stats?.stake?.epoch)
        .map(item => item.stats.stake.epoch),
      changeLovelaceToAda: true,
    },
    {
      key: "staked_wallets",
      title: "Staked Wallets",
      epochs: ([...filteredDataItems].reverse() || [])
        .filter(item => item?.stats?.stake?.accounts)
        .map(item => item.no),
      data: ([...filteredDataItems].reverse() || [])
        .filter(item => item?.stats?.stake?.accounts)
        .map(item => item.stats.stake.accounts),
    },
    {
      key: "rewards",
      title: "Rewards",
      epochs: ([...filteredDataItems].reverse() || [])
        .filter(item => item?.stats?.stake?.active)
        .map(item => item.no),
      data: ([...filteredDataItems].reverse() || [])
        .filter(item => item?.stats?.stake?.active)
        .map(item => item?.stats?.stake?.active),
      changeLovelaceToAda: true,
    },
    {
      key: "active_wallets",
      title: "Active Wallets",
      epochs: ([...filteredAnalyticsEpoch].reverse() || [])
        .filter(item => item.stat && item?.stat?.count_tx_out_stake)
        .map(item => item.no),
      data: ([...filteredAnalyticsEpoch].reverse() || [])
        .filter(item => item.stat && item?.stat?.count_tx_out_stake)
        .map(item => item?.stat?.count_tx_out_stake as number),
    },
    {
      key: "new_wallets",
      title: "New Wallets",
      epochs: ([...filteredAnalyticsEpoch].reverse() || [])
        .filter(
          item => item.stat && item?.stat?.count_tx_out_stake_not_yesterday,
        )
        .map(item => item.no),
      data: ([...filteredAnalyticsEpoch].reverse() || [])
        .filter(
          item => item.stat && item?.stat?.count_tx_out_stake_not_yesterday,
        )
        .map(item => item?.stat?.count_tx_out_stake_not_yesterday as number),
    },
  ];

  useEffect(() => {
    setColorByTheme(theme === "light" ? "black" : "white");
  }, [theme]);

  return (
    <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
      <div className='flex w-full flex-col items-center justify-between gap-1 rounded-m border border-border p-mobile md:p-desktop'>
        {analyticsData.map(
          ({
            data,
            epochs,
            title,
            tooltipProcents,
            changeLovelaceToAda,
            key,
          }) => {
            const option: ReactEChartsProps["option"] = {
              grid: {
                left: "10%",
                right: "10%",
                top: "10%",
                bottom: "10%",
                containLabel: true,
              },
              xAxis: {
                type: "category",
                data: epochs,
                name: "Epochs",
                nameLocation: "middle",
                nameGap: 30,
              },
              yAxis: {
                type: "value",
                axisLabel: {
                  color: colorByTheme,
                  hideOverlap: true,
                  formatter: value => {
                    if (changeLovelaceToAda) {
                      return lovelaceToAda(value) as any;
                    }

                    return formatNumberWithSuffix(value) as any;
                  },
                },
              },
              series: [
                {
                  data,
                  type: "bar",
                  itemStyle: {
                    color: "#e3033a",
                  },
                },
              ],
              textStyle: {
                fontWeight: "bold",
              },
              tooltip: {
                trigger: "axis",
                confine: true,
                axisPointer: {
                  type: "shadow-md",
                },
                backgroundColor: bgColor,
                textStyle: {
                  color: textColor,
                  fontWeight: "normal",
                },
                formatter: function (params) {
                  const epoch = +params?.[0]?.name;
                  const value = params?.[0]?.data;
                  const marker = params?.[0]?.marker || "";
                  const titleFormatted = title;

                  const { startTime, endTime } = calculateEpochTimeByNumber(
                    epoch,
                    filteredDataItems?.[filteredDataItems.length - 1]?.no || 0,
                    filteredDataItems?.[filteredDataItems.length - 1]
                      ?.start_time || "",
                  );

                  let formattedValue = "";

                  if (changeLovelaceToAda) {
                    formattedValue = lovelaceToAda(value);
                  } else if (tooltipProcents) {
                    formattedValue = value.toFixed(2) + "%";
                  } else {
                    formattedValue = formatNumber(value);
                  }

                  return `
      Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${epoch})<hr style="margin: 4px 0;" />
      <p>${marker} ${titleFormatted}: ${formattedValue}</p>
    `;
                },
              },
            };

            return (
              <div
                key={key}
                className='flex h-full w-full flex-col items-center'
              >
                <div className='flex flex-col self-start'>
                  <span className='text-text-lg font-semibold'>{title}</span>
                  <span className='text-text-md font-semibold text-grayTextPrimary'>
                    By epoch
                  </span>
                </div>
                <div className='relative w-full' ref={echartsRef}>
                  {isLoading || isError ? (
                    <div className='flex h-[320px] w-full items-center justify-center'>
                      <LoadingSkeleton height='85%' width='85%' />
                    </div>
                  ) : (
                    <>
                      <span className='absolute left-0 top-1/2 -translate-y-1/2 rotate-[270deg] text-text-xs font-bold text-[#6e7076] md:left-[4%] xl:left-[7%]'>
                        Values
                      </span>
                      <GraphWatermark />
                      <ReactEcharts
                        opts={{ height: 320 }}
                        option={option}
                        notMerge={true}
                        lazyUpdate={true}
                        className='h-full w-full'
                      />
                    </>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};
