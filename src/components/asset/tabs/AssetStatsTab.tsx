import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchAssetStats } from "@/services/assets";
import { formatNumber } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import ReactEcharts from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { useMiscConst } from "@/hooks/useMiscConst";

interface Props {
  fingerprint: string;
}

export const AssetStatsTab = ({ fingerprint }: Props) => {
  const query = useFetchAssetStats(undefined, fingerprint);
  const data = query.data?.data?.data;
  const epochs = data?.map(item => item.epoch) || [];
  const ada_volume = data?.map(item => item.stat[0].ada_volume) || [];
  const asset_volume = data?.map(item => item.stat[0].asset_volume) || [];
  const payment_cred = data?.map(item => item.stat[0].payment_cred) || [];
  const stake = data?.map(item => item.stat[0].stake) || [];
  const address = data?.map(item => item.stat[0].address) || [];
  const with_data = data?.map(item => item.stat[0].with_data) || [];

  const {
    textColor,
    inactivePageIconColor,
    bgColor,
    splitLineColor,
    lineColor,
    purpleColor,
  } = useGraphColors();
  const miscConst = useMiscConst(query.data?.data[0]?.version?.const);
  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const [graphsVisibility, setGraphsVisibility] = useState({
    "ADA Output": true,
    "Asset Volume": true,
    "Interacting Payment Credentials": false,
    "Interacting Accounts": true,
    "Interacting Addresses": false,
    "Smart Transactions": true,
  });

  const option: ReactEChartsProps["option"] = {
    legend: {
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
      type: "scroll",
      data: Object.keys(graphsVisibility),
      selected: { ...graphsVisibility },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: function (params) {
        if (!params || params.length === 0) return "";
        const marker = item => item.marker || "";
        const epoch = +params[0].axisValue;
        const { startTime, endTime } = calculateEpochTimeByNumber(
          epoch,
          miscConst?.epoch?.no ?? 0,
          miscConst?.epoch?.start_time ?? "",
        );

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${epoch})<hr/>` +
          params
            .map(item => {
              const value = Number(item.data);
              let formatted = "—";
              if (!isNaN(value)) {
                if (
                  item.seriesName === "ADA Output" ||
                  item.seriesName === "Asset Volume"
                ) {
                  formatted = lovelaceToAda(value);
                } else {
                  formatted = formatNumber(value);
                }
              }
              return `<p style="margin:2px 0;">${marker(item)} ${item.seriesName}: ${formatted}</p>`;
            })
            .join("")
        );
      },
    },
    grid: { top: 40, right: 10, bottom: 40, left: 10 },
    xAxis: {
      type: "category",
      data: epochs,
      inverse: true,
      name: "Epoch",
      nameLocation: "middle",
      nameGap: 28,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: Array.from({ length: 6 }).map((_, i) => ({
      type: "value",
      show: i === 0,
      id: String(i),
      axisLabel: {
        show: false,
        margin: 0,
      },
      nameRotate: 90,
      nameLocation: "middle",
      splitLine: { lineStyle: { color: splitLineColor } },
      axisLine: { lineStyle: { color: textColor } },
    })),
    series: [
      {
        type: "line",
        data: ada_volume,
        name: "ADA Output",
        yAxisIndex: 0,
        itemStyle: { opacity: 0.9, color: purpleColor },
        showSymbol: false,
      },
      {
        type: "line",
        data: asset_volume,
        name: "Asset Volume",
        yAxisIndex: 1,
        itemStyle: { opacity: 0.7, color: "#ffc115" },
        showSymbol: false,
      },
      {
        type: "line",
        data: payment_cred,
        name: "Interacting Payment Credentials",
        yAxisIndex: 2,
        itemStyle: { opacity: 0.7, color: lineColor },
        showSymbol: false,
      },
      {
        type: "line",
        data: stake,
        name: "Interacting Accounts",
        yAxisIndex: 3,
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
      },
      {
        type: "line",
        data: address,
        name: "Interacting Addresses",
        yAxisIndex: 4,
        itemStyle: { opacity: 0.7, color: textColor },
        showSymbol: false,
      },
      {
        type: "bar",
        data: with_data,
        name: "Smart Transactions",
        yAxisIndex: 5,
        itemStyle: { opacity: 0.6, color: "#e3033a" },
      },
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("asset_stats_graph_store") as string,
      );
      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "asset_stats_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 350 }}
        onChartReady={onChartReadyCallback}
        onEvents={{
          legendselectchanged: params => {
            localStorage.setItem(
              "asset_stats_graph_store",
              JSON.stringify(params.selected),
            );
          },
        }}
        option={option}
        notMerge
        lazyUpdate
        className='mb-12 h-full min-h-[350px] w-full'
      />
    </div>
  );
};
