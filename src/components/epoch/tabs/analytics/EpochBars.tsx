import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { format } from "date-fns";
import ReactEcharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { MiscConstResponseData } from "@/types/miscTypes";

interface EpochBars {
  stats: EpochStatsSummary;
  isError: boolean;
  isLoading: boolean;
  constData?: MiscConstResponseData;
}

export const EpochBars: FC<EpochBars> = ({
  stats,
  isError,
  isLoading,
  constData,
}) => {
  const { bgColor, textColor } = useGraphColors();

  const epochDates = (stats?.daily || []).map(item =>
    new Date(item?.date).getTime(),
  );

  const fees =
    (stats?.pots?.fees ?? 1) *
    (1 - +(constData?.epoch_param?.treasury_growth_rate ?? 0.2));
  const reserves =
    (stats?.pots?.reserves ?? 1) *
    +(constData?.epoch_param?.monetary_expand_rate ?? 0.003) *
    (1 - +(constData?.epoch_param?.treasury_growth_rate ?? 0.2));

  const pieChartTotal = fees + reserves;

  const feesPercentage = (fees / pieChartTotal) * 100;
  const reservesPercentage = (reserves / pieChartTotal) * 100;

  const items = [
    {
      key: "blocks_in_epoch",
      title: "Blocks in Epoch",
      width: "600px",
      data: (stats?.daily || [])
        .map(item => item?.stat?.count_block ?? 0)
        .filter(item => item > 0),
    },
    {
      key: "txs_epoch",
      title: "Transactions in Epoch",
      width: "600px",
      data: (stats?.daily || [])
        .map(item => item?.stat?.count_tx ?? 0)
        .filter(item => item > 0),
    },
    {
      key: "blk_size_used",
      title: "Block Size Used",
      width: "600px",
      data: (stats?.daily || [])
        .map(item => item?.stat?.avg_block_size ?? 0)
        .filter(item => +item > 0),
    },
    {
      key: "new_wallets",
      title: "New Wallets",
      width: "600px",
      data: (stats?.daily || [])
        .map(item => item?.stat?.count_tx_out_stake ?? 0)
        .filter(item => item > 0),
    },
    {
      key: "active_wallets",
      title: "Active Wallets",
      width: "100%",
      data: (stats?.daily || [])
        .map(item => item?.stat?.count_tx_out_address_not_yesterday ?? 0)
        .filter(item => item > 0),
    },
    {
      key: "fees_earned",
      title: "Fees Earned",
      width: "600px",
      data: (stats?.daily || [])
        .map(item => item?.stat?.sum_fee ?? 0)
        .filter(item => item > 0),
    },
  ];

  const pieOption = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: param => {
        const color = param.color;
        return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:5px;"></span>${param.data.name}: ${param.data.value}%`;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
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
            value: feesPercentage.toFixed(2),
            name: "Fees",
            itemStyle: { color: "#47CD89" },
          },
          {
            value: reservesPercentage.toFixed(2),
            name: "Reserves",
            itemStyle: { color: "#FEC84B" },
          },
        ],
      },
    ],
  };

  return (
    <div className='flex w-full flex-grow flex-wrap gap-1 pb-4'>
      {items.map(({ key, title, width, data }) => {
        const option: ReactEChartsProps["option"] = {
          grid: {
            left: "1%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: epochDates,
            axisLabel: {
              formatter: value => format(new Date(+value), "dd.MM.yyyy"),
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: value => {
                if (key === "fees_earned") {
                  return lovelaceToAda(value);
                }

                return value > 0 ? formatNumber(value) : "0";
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
            color: textColor,
            fontWeight: 400,
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            backgroundColor: bgColor,
            textStyle: {
              color: textColor,
            },
            formatter: param => {
              const date = format(new Date(+param[0].axisValue), "dd.MM.yyyy");
              const value = +param[0].value;

              let formattedValue = "";

              if (key === "fees_earned") {
                formattedValue = `${lovelaceToAda(value)}`;
              } else if (key === "blk_size_used") {
                formattedValue = `${value.toFixed(2)} B`;
              } else {
                formattedValue = formatNumber(value);
              }

              return `<div>${title} (${date}): ${formattedValue}</div>`;
            },
            axisPointer: {
              type: "shadow",
            },
          },
        };

        return (
          <div
            style={{ flexBasis: width }}
            className='flex w-full flex-grow flex-col gap-1 rounded-l border border-border p-3'
            key={key}
          >
            <div className='flex flex-col'>
              <h3>{title}</h3>
              <span className='text-text-md font-semibold text-grayTextPrimary'>
                by day
              </span>
            </div>
            {isLoading || isError ? (
              <LoadingSkeleton height='320px' w-full rounded='lg' />
            ) : (
              <div className='relative w-full'>
                <GraphWatermark />
                <ReactEcharts
                  opts={{ height: 320 }}
                  option={option}
                  className='h-full w-full'
                />
              </div>
            )}
          </div>
        );
      })}
      <div className='flex h-[520px] w-full max-w-[650px] flex-grow flex-col gap-1 rounded-l border border-border p-3'>
        <div className='flex flex-col'>
          <h3>Rewards Structure</h3>
          <span className='text-text-md font-semibold text-grayTextPrimary'>
            Earned by fees / Reserves
          </span>
        </div>
        <div className='relative w-full'>
          {isLoading || isError || !stats ? (
            <LoadingSkeleton height='320px' rounded='lg' />
          ) : (
            <ReactEcharts
              opts={{ height: 400 }}
              option={pieOption}
              className='h-[520px] w-full'
            />
          )}
        </div>
      </div>
    </div>
  );
};
