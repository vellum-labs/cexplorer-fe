import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchAssetStats } from "@/services/assets";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import ReactEcharts from "echarts-for-react";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  fingerprint: string;
}

export const AssetStatsTab = ({ fingerprint }: Props) => {
  const { t } = useAppTranslation("common");
  const query = useFetchAssetStats(undefined, fingerprint);
  const data = query.data?.data?.data;
  const epochs = data?.map(item => item.epoch) || [];
  const ada_volume =
    data?.map(item =>
      Array.isArray(item?.stat) ? item?.stat?.[0]?.ada_volume : 0,
    ) || [];
  const asset_volume =
    data?.map(item =>
      Array.isArray(item?.stat) ? item.stat?.[0]?.asset_volume : 0,
    ) || [];
  const payment_cred =
    data?.map(item =>
      Array.isArray(item?.stat) ? item.stat?.[0]?.payment_cred : 0,
    ) || [];
  const stake =
    data?.map(item =>
      Array.isArray(item?.stat) ? item.stat?.[0]?.stake : 0,
    ) || [];
  const address =
    data?.map(item =>
      Array.isArray(item?.stat) ? item.stat?.[0]?.address : 0,
    ) || [];
  const with_data =
    data?.map(item =>
      Array.isArray(item?.stat) ? item.stat?.[0]?.with_data : 0,
    ) || [];

  const {
    textColor,
    inactivePageIconColor,
    bgColor,
    splitLineColor,
    lineColor,
    purpleColor,
  } = useGraphColors();
  const { formatLovelace } = useADADisplay();
  const miscConst = useMiscConst(query.data?.data[0]?.version?.const);
  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const [graphsVisibility, setGraphsVisibility] = useState(() => {
    try {
      const stored = localStorage.getItem("asset_stats_graph_store");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.log(e);
    }
    return {
      [t("asset.adaOutput")]: true,
      [t("asset.assetVolume")]: true,
      [t("asset.interactingPaymentCredentials")]: false,
      [t("asset.interactingAccounts")]: true,
      [t("asset.interactingAddresses")]: false,
      [t("asset.smartTransactions")]: true,
    };
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
          `${t("labels.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("labels.epoch")}: ${epoch})<hr/>` +
          params
            .map(item => {
              const value = Number(item.data);
              let formatted = "—";
              if (!isNaN(value)) {
                if (
                  item.seriesName === t("asset.adaOutput") ||
                  item.seriesName === t("asset.assetVolume")
                ) {
                  formatted = formatLovelace(value);
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
        name: t("asset.adaOutput"),
        yAxisIndex: 0,
        itemStyle: { opacity: 0.9, color: purpleColor },
        showSymbol: false,
      },
      {
        type: "line",
        data: asset_volume,
        name: t("asset.assetVolume"),
        yAxisIndex: 1,
        itemStyle: { opacity: 0.7, color: "#ffc115" },
        showSymbol: false,
      },
      {
        type: "line",
        data: payment_cred,
        name: t("asset.interactingPaymentCredentials"),
        yAxisIndex: 2,
        itemStyle: { opacity: 0.7, color: lineColor },
        showSymbol: false,
      },
      {
        type: "line",
        data: stake,
        name: t("asset.interactingAccounts"),
        yAxisIndex: 3,
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
      },
      {
        type: "line",
        data: address,
        name: t("asset.interactingAddresses"),
        yAxisIndex: 4,
        itemStyle: { opacity: 0.7, color: textColor },
        showSymbol: false,
      },
      {
        type: "bar",
        data: with_data,
        name: t("asset.smartTransactions"),
        yAxisIndex: 5,
        itemStyle: { opacity: 0.6, color: "#e3033a" },
      },
    ],
  };

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
        className='mb-6 h-full min-h-[350px] w-full'
      />
    </div>
  );
};
