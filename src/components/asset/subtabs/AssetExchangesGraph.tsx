import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import SortBy from "@/components/ui/sortBy";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useFetchAssetExchangesGraph } from "@/services/assets";
import { Loading } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AssetExchangesCandlestickGraphProps {
  assetname: string;
  className?: string;
}

type Periods = "1min" | "5min" | "15min" | "30min" | "1hour" | "4hour" | "1day";

export const AssetExchangesCandlestickGraph: FC<
  AssetExchangesCandlestickGraphProps
> = ({ assetname, className }) => {
  const { t } = useAppTranslation("common");
  const LS_KEY = "asset_exchanges_candlestick_period";

  const [period, setPeriod] = useState<string | undefined>(() => {
    return localStorage.getItem(LS_KEY) || "4hour";
  });

  const { textColor, splitLineColor } = useGraphColors();

  const { data: rawData, isLoading } = useFetchAssetExchangesGraph(
    assetname,
    period as Periods,
  );

  useEffect(() => {
    if (period) {
      localStorage.setItem(LS_KEY, period);
    }
  }, [period]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const hasData = (rawData?.data?.length ?? 0) > 0;

  const candlestickData = useMemo(
    () =>
      rawData?.data?.map(item => ({
        time: item.unix as UTCTimestamp,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
      })) ?? [],
    [rawData?.data],
  );

  const volumeData = useMemo(
    () =>
      rawData?.data?.map(item => ({
        time: item.unix as UTCTimestamp,
        value: Number(item.volume),
        color:
          Number(item.close) >= Number(item.open)
            ? "rgba(14, 203, 129, 0.5)"
            : "rgba(246, 70, 93, 0.5)",
      })) ?? [],
    [rawData?.data],
  );

  const buildChart = useCallback(() => {
    if (!chartContainerRef.current || !hasData) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor,
      },
      grid: {
        vertLines: { color: splitLineColor },
        horzLines: { color: splitLineColor },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: splitLineColor,
      },
      rightPriceScale: {
        borderColor: splitLineColor,
      },
      crosshair: {
        mode: 0,
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#0ecb81",
      downColor: "#f6465d",
      borderUpColor: "#0ecb81",
      borderDownColor: "#f6465d",
      wickUpColor: "#0ecb81",
      wickDownColor: "#f6465d",
    });

    candleSeries.setData(candlestickData);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();
  }, [hasData, candlestickData, volumeData, textColor, splitLineColor]);

  useEffect(() => {
    buildChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [buildChart]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !chartRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chartRef.current?.applyOptions({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasData, buildChart]);

  const selectItems = [
    { key: "1min", value: t("asset.oneMin") },
    { key: "5min", value: t("asset.fiveMin") },
    { key: "15min", value: t("asset.fifteenMin") },
    { key: "30min", value: t("asset.thirtyMin") },
    { key: "1hour", value: t("asset.oneHour") },
    { key: "4hour", value: t("asset.fourHours") },
    { key: "1day", value: t("asset.oneDay") },
  ];

  return (
    <div
      className={`w-full rounded-m border border-border bg-cardBg p-5 ${className || ""}`}
    >
      <div className={`flex flex-col justify-end pb-3 md:flex-row md:pb-3`}>
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
        ) : !hasData ? (
          <div className='flex h-full w-full items-center justify-center text-text-sm text-text'>
            <span>{t("asset.noDataAvailable")}</span>
          </div>
        ) : (
          <div className='relative h-[300px] w-full'>
            <GraphWatermark />
            <div ref={chartContainerRef} className='h-full w-full' />
          </div>
        )}
      </div>
    </div>
  );
};
