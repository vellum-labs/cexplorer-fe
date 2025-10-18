import type { FC } from "react";
import { useEffect, useState } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import SortBy from "@/components/ui/sortBy";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useFetchAssetExchangesGraph } from "@/services/assets";
import { Loading } from "@vellumlabs/cexplorer-sdk";

import { format } from "date-fns";

interface AssetExchangesCandlestickGraphProps {
  assetname: string;
}

type Periods = "1min" | "5min" | "15min" | "30min" | "1hour" | "4hour" | "1day";

export const AssetExchangesCandlestickGraph: FC<
  AssetExchangesCandlestickGraphProps
> = ({ assetname }) => {
  const LS_KEY = "asset_exchanges_candlestick_period";

  const [period, setPeriod] = useState<string | undefined>(() => {
    return localStorage.getItem(LS_KEY) || "4hour";
  });

  const { textColor, splitLineColor, bgColor } = useGraphColors();

  const { data: rawData, isLoading } = useFetchAssetExchangesGraph(
    assetname,
    period as Periods,
  );

  const volumeData = rawData?.data.map(item => Number(item.volume)) ?? [];

  useEffect(() => {
    if (period) {
      localStorage.setItem(LS_KEY, period);
    }
  }, [period]);

  const candlestickData =
    rawData?.data.map(item => [
      Number(item.open),
      Number(item.close),
      Number(item.low),
      Number(item.high),
    ]) ?? [];

  const candlestickTimestamps =
    rawData?.data.map(item =>
      format(new Date(item.unix * 1000), "dd.MM.yyyy HH:mm"),
    ) ?? [];

  const formatAxisTimestamp = (timestamp: string, period: string) => {
    const date = new Date(
      timestamp.split(" ")[0].split(".").reverse().join("-") +
        "T" +
        timestamp.split(" ")[1],
    );

    switch (period) {
      case "1min":
      case "5min":
      case "15min":
      case "30min":
        return format(date, "HH:mm");
      case "1hour":
      case "4hour":
        return format(date, "dd.MM HH:mm");
      case "1day":
        return format(date, "dd.MM");
      default:
        return format(date, "dd.MM");
    }
  };

  const axisTimestamps = candlestickTimestamps.map(ts =>
    formatAxisTimestamp(ts, period || "4hour"),
  );

  const getAxisLabelInterval = (dataLength: number, period: string) => {
    if (dataLength <= 10) return 0;
    if (dataLength <= 24) return 1;
    if (dataLength <= 48) return 3;
    if (period === "1min" || period === "5min")
      return Math.floor(dataLength / 6);
    if (period === "15min" || period === "30min")
      return Math.floor(dataLength / 8);
    if (period === "1hour") return Math.floor(dataLength / 6);
    return Math.floor(dataLength / 10);
  };

  const selectItems = [
    { key: "1min", value: "1 min" },
    { key: "5min", value: "5 min" },
    { key: "15min", value: "15 min" },
    { key: "30min", value: "30 min" },
    { key: "1hour", value: "1 hour" },
    { key: "4hour", value: "4 hours" },
    { key: "1day", value: "1 day" },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: { type: "cross" },
      backgroundColor: bgColor,
      textStyle: { color: textColor },

      formatter: params => {
        const [dataPoint] = params;
        const { axisValue, data, dataIndex } = dataPoint;
        const volume = volumeData?.[dataIndex] ?? 0;

        return `
    <div>
      <div style="margin-bottom: 6px;">${axisValue}</div>
      <hr style="margin: 4px 0;" />
      <div>Open price: ${Number(data[1]).toFixed(6)} ₳</div>
      <div>Close price: ${Number(data[2]).toFixed(6)} ₳</div>
      <div>Lowest price: ${Number(data[3]).toFixed(6)} ₳</div>
      <div>Highest price: ${Number(data[4]).toFixed(6)} ₳</div>
      <div>Volume: ${volume.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ₳</div>
    </div>
  `;
      },
    },
    grid: [
      {
        top: 40,
        left: 60,
        right: 20,
        height: "50%",
      },
      {
        left: 60,
        right: 20,
        bottom: 60,
        height: "20%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: axisTimestamps,
        boundaryGap: true,
        axisLabel: { show: false },
        axisPointer: {
          type: "line",
          lineStyle: { width: 0 },
          label: { show: false },
        },
      },
      {
        type: "category",
        data: axisTimestamps,
        gridIndex: 1,
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: textColor,
          rotate: period === "1min" || period === "5min" ? 45 : 0,
          interval: getAxisLabelInterval(
            axisTimestamps.length,
            period || "4hour",
          ),
          fontSize: 11,
          margin: 15,
        },
        axisTick: { show: true, lineStyle: { color: textColor } },
        axisLine: { lineStyle: { color: textColor } },
        axisPointer: { show: false },
      },
    ],
    yAxis: [
      {
        scale: true,
        axisLine: { lineStyle: { color: textColor } },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLabel: { color: textColor },
        axisPointer: {
          label: {
            backgroundColor: bgColor,
            color: textColor,
          },
        },
      },
      {
        gridIndex: 1,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisPointer: { show: false },
      },
    ],
    series: [
      {
        name: "Price",
        type: "candlestick",
        data: candlestickData,
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: "#0ecb81",
          color0: "#f6465d",
          borderColor: "#0ecb81",
          borderColor0: "#f6465d",
        },
      },
      {
        name: "Volume",
        type: "bar",
        data: volumeData,
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: "#8884d8",
        },
        tooltip: { show: false },
      },
    ],
  };

  return (
    <div className={`w-full rounded-m border border-border bg-cardBg p-5`}>
      <div className={`flex flex-col justify-end pb-1.5 md:flex-row md:pb-0`}>
        <SortBy
          label={false}
          width='160px'
          selectItems={selectItems}
          selectedItem={period}
          setSelectedItem={setPeriod}
        />
      </div>

      <div className='h-[300px]'>
        {isLoading ? (
          <Loading className='min-h-[300px]' />
        ) : candlestickData.length === 0 ? (
          <div className='flex h-full w-full items-center justify-center text-text-sm text-text'>
            <span>No data available for selected period</span>
          </div>
        ) : (
          <div className='relative h-[300px] w-full'>
            <GraphWatermark />
            <ReactEcharts
              option={option}
              notMerge
              lazyUpdate
              className='h-full w-full'
            />
          </div>
        )}
      </div>
    </div>
  );
};
