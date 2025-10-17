import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { useFetchDrepAnalytics } from "@/services/drep";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "../global/graphs/GraphWatermark";

import { useEffect, useRef, useState } from "react";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

interface DrepPoolGraphProps {
  epochs: number[];
  query: ReturnType<typeof useFetchDrepAnalytics>;
}

export const DrepPoolGraph: FC<DrepPoolGraphProps> = ({ epochs, query }) => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const [graphsVisibility, setGraphsVisibility] = useState({
    "Total Delegated Stake (₳)": true,
    "Drep Delegated": true,
    "Abstain Drep (₳)": true,
    "No Confidence Drep (₳)": true,
  });

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const totalDelegatedStake = query?.data?.drep_distr
    ?.filter(item => item.amount)
    .map(item => item?.amount);
  const totalDrepCount = query?.data?.drep_distr
    ?.filter(item => item.count)
    ?.map(item => item?.count);
  const alwaysAbstainDrep = query?.data?.drep_distr
    ?.filter(item => item?.drep_always_abstain)
    ?.map(item => item?.drep_always_abstain);
  const noConfidanceDrep = query?.data?.drep_distr
    ?.filter(item => item?.drep_always_no_confidence)
    ?.map(item => item?.drep_always_no_confidence);

  const option: ReactEChartsProps["option"] = {
    legend: {
      type: "scroll",
      data: [
        "Total Delegated Stake (₳)",
        "Drep Delegated",
        "Abstain Drep (₳)",
        "No Confidence Drep (₳)",
      ],
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
      formatter: function (params) {
        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              let label = item.seriesName;
              let value;

              if (label === "Total Delegated Stake (₳)") {
                label = "Total Delegated Stake";
                value = lovelaceToAda(item.data);
              } else if (label === "Abstain Drep (₳)") {
                label = "Abstain Drep";
                value = lovelaceToAda(item.data);
              } else if (label === "No Confidence Drep (₳)") {
                label = "No Confidence Drep";
                value = lovelaceToAda(item.data);
              } else {
                value = formatNumber(item.data);
              }

              return `<p>${item.marker} ${label}: ${value}</p>`;
            })
            .join("")
        );
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
      inverse: true,
      name: "Epoch",
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
        show: true,
        id: "0",
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
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
    ],
    series: [
      {
        type: "line",
        name: "Total Delegated Stake (₳)",
        data: totalDelegatedStake,
        yAxisIndex: 0,
        itemStyle: { color: "#35c2f5" },
        showSymbol: false,
        z: 2,
      },
      {
        type: "line",
        name: "Drep Delegated",
        data: totalDrepCount,
        yAxisIndex: 2,
        itemStyle: { color: textColor },
        showSymbol: false,
        z: 3,
      },
      {
        type: "line",
        name: "Abstain Drep (₳)",
        data: alwaysAbstainDrep,
        yAxisIndex: 1,
        areaStyle: { opacity: 0.12 },
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
        z: 4,
      },
      {
        type: "line",
        name: "No Confidence Drep (₳)",
        data: noConfidanceDrep,
        yAxisIndex: 1,
        areaStyle: { opacity: 0.12 },
        itemStyle: { color: "#ffc115" },
        showSymbol: false,
        z: 5,
      },
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drep_pool_graph_store");
      if (stored) {
        setGraphsVisibility(JSON.parse(stored));
      } else {
        localStorage.setItem(
          "drep_pool_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 400 }}
        onChartReady={onChartReadyCallback}
        onEvents={{
          legendselectchanged: params => {
            const { selected } = params;
            localStorage.setItem(
              "drep_pool_graph_store",
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
  );
};
