import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { StablecoinData } from "@/types/stablecoinTypes";
import type { FC } from "react";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { formatNumber, formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
import ReactEcharts from "echarts-for-react";
import { useRef, useState } from "react";
import GraphWatermark from "../global/graphs/GraphWatermark";

interface StablecoinAnalyticsGraphProps {
  data: StablecoinData[];
}

const KEYS = {
  activity: "activity",
  assetVolume: "assetVolume",
  holders: "holders",
};

export const StablecoinAnalyticsGraph: FC<StablecoinAnalyticsGraphProps> = ({
  data,
}) => {
  const { t } = useAppTranslation();
  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const chartRef = useRef(null);

  const [graphsVisibility, setGraphsVisibility] = useState(() => {
    try {
      const stored = localStorage.getItem("stablecoin_graph_store");
      if (stored) return JSON.parse(stored);
    } catch (_e) {
      /* ignore */
    }
    return {
      [KEYS.activity]: true,
      [KEYS.assetVolume]: true,
      [KEYS.holders]: true,
    };
  });

  const legendLabels: Record<string, string> = {
    [KEYS.activity]: t("stablecoinDashboard.activity"),
    [KEYS.assetVolume]: t("stablecoinDashboard.assetVolume"),
    [KEYS.holders]: t("stablecoinDashboard.holders"),
  };

  // Collect all unique epochs across all stablecoins, sorted chronologically
  const epochSet = new Set<number>();
  for (const sc of data) {
    for (const s of sc.stat) {
      epochSet.add(s.epoch);
    }
  }
  const epochs = [...epochSet].sort((a, b) => a - b);

  // Build cumulative data per epoch (sum across all stablecoins)
  const activityData: number[] = [];
  const assetVolumeData: number[] = [];
  const holdersData: number[] = [];

  for (const epoch of epochs) {
    let totalCount = 0;
    let totalAssetVolume = 0;
    let totalHolders = 0;

    for (const sc of data) {
      const decimals = sc.registry?.decimals ?? 0;
      const stat = sc.stat.find(s => s.epoch === epoch);
      if (stat?.data?.[0]) {
        totalCount += stat.data[0].count ?? 0;
        totalAssetVolume += (stat.data[0].asset_volume ?? 0) / 10 ** decimals;
        totalHolders += stat.data[0].holders ?? 0;
      }
    }

    activityData.push(totalCount);
    assetVolumeData.push(totalAssetVolume);
    holdersData.push(totalHolders);
  }

  // Build per-stablecoin breakdown for tooltip
  const buildTooltipBreakdown = (epochIdx: number): string => {
    const epoch = epochs[epochIdx];
    return data
      .map(sc => {
        const ticker = sc.registry?.ticker ?? sc.fingerprint.slice(0, 10);
        const stat = sc.stat.find(s => s.epoch === epoch);
        const d = stat?.data?.[0];
        if (!d) return "";
        const decimals = sc.registry?.decimals ?? 0;
        return `<div style="margin-left:8px;font-size:11px;color:${textColor};">${ticker}: ${formatNumber(d.count)} txs, vol $${formatNumberWithSuffix(d.asset_volume / 10 ** decimals)}, ${formatNumber(d.holders)} holders</div>`;
      })
      .filter(Boolean)
      .join("");
  };

  const option: ReactEChartsProps["option"] = {
    legend: {
      type: "scroll",
      data: [
        { name: KEYS.activity, icon: "circle" },
        { name: KEYS.assetVolume, icon: "circle" },
        { name: KEYS.holders, icon: "circle" },
      ],
      formatter: (name: string) => legendLabels[name] || name,
      selected: graphsVisibility,
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      confine: true,
      textStyle: { color: textColor },
      formatter: function (params: any) {
        const epochIdx = params[0]?.dataIndex;
        const epochNo = params[0]?.axisValue;

        let html = `<div style="font-weight:600;">Epoch ${epochNo}</div><hr style="margin:4px 0;">`;
        html += params
          .map(
            (item: any) => {
              const prefix = item.seriesName === KEYS.assetVolume ? "$" : "";
              return `<p>${item.marker} ${legendLabels[item.seriesName]}: ${prefix}${formatNumberWithSuffix(item.data)}</p>`;
            },
          )
          .join("");

        html += `<hr style="margin:4px 0;"><div style="font-size:11px;font-weight:600;margin-bottom:2px;">Breakdown:</div>`;
        html += buildTooltipBreakdown(epochIdx);

        return html;
      },
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 18,
    },
    xAxis: {
      type: "category",
      data: epochs,
      name: t("common:labels.epoch"),
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        id: "0",
        show: true,
        axisLabel: { show: false, color: textColor },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        id: "1",
        show: false,
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "left",
        id: "2",
        show: false,
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: textColor } },
      },
    ],
    series: [
      {
        type: "line",
        name: KEYS.activity,
        data: activityData,
        yAxisIndex: 0,
        itemStyle: { color: "#35c2f5" },
        showSymbol: false,
        z: 2,
      },
      {
        type: "line",
        name: KEYS.assetVolume,
        data: assetVolumeData,
        yAxisIndex: 1,
        itemStyle: { color: "#ffc115" },
        showSymbol: false,
        z: 3,
      },
      {
        type: "line",
        name: KEYS.holders,
        data: holdersData,
        yAxisIndex: 2,
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
        z: 4,
      },
    ],
  };

  return (
    <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
      <h2 className='mb-2 text-text-lg font-semibold text-text'>
        {t("stablecoinDashboard.analytics")}
      </h2>
      <div className='relative w-full rounded-m border border-border bg-cardBg p-4'>
        <GraphWatermark />
        <ReactEcharts
          opts={{ height: 400 }}
          onChartReady={chart => {
            chartRef.current = chart;
          }}
          onEvents={{
            legendselectchanged: (params: any) => {
              const { selected } = params;
              setGraphsVisibility(selected);
              localStorage.setItem(
                "stablecoin_graph_store",
                JSON.stringify(selected),
              );
            },
          }}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full min-h-[400px] w-full'
        />
      </div>
    </section>
  );
};
