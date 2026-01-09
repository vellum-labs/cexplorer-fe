import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { useFetchDrepAnalytics } from "@/services/drep";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "../global/graphs/GraphWatermark";

import { useEffect, useRef, useState } from "react";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DrepPoolGraphProps {
  epochs: number[];
  query: ReturnType<typeof useFetchDrepAnalytics>;
}

export const DrepPoolGraph: FC<DrepPoolGraphProps> = ({ epochs, query }) => {
  const { t } = useAppTranslation("pages");

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const { formatLovelace } = useADADisplay();

  // Keys for series (used for matching in tooltip and localStorage)
  const KEYS = {
    totalDelegatedStake: "totalDelegatedStake",
    drepDelegated: "drepDelegated",
    abstainDrep: "abstainDrep",
    noConfidenceDrep: "noConfidenceDrep",
  };

  const [graphsVisibility, setGraphsVisibility] = useState({
    [KEYS.totalDelegatedStake]: true,
    [KEYS.drepDelegated]: true,
    [KEYS.abstainDrep]: true,
    [KEYS.noConfidenceDrep]: true,
  });

  const legendLabels = {
    [KEYS.totalDelegatedStake]: t("dreps.graphs.drepPool.totalDelegatedStake"),
    [KEYS.drepDelegated]: t("dreps.graphs.drepPool.drepDelegated"),
    [KEYS.abstainDrep]: t("dreps.graphs.drepPool.abstainDrep"),
    [KEYS.noConfidenceDrep]: t("dreps.graphs.drepPool.noConfidenceDrep"),
  };

  const tooltipLabels = {
    [KEYS.totalDelegatedStake]: t("dreps.graphs.drepPool.totalDelegatedStakeShort"),
    [KEYS.drepDelegated]: t("dreps.graphs.drepPool.drepDelegated"),
    [KEYS.abstainDrep]: t("dreps.graphs.drepPool.abstainDrepShort"),
    [KEYS.noConfidenceDrep]: t("dreps.graphs.drepPool.noConfidenceDrepShort"),
  };

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
        { name: KEYS.totalDelegatedStake, icon: "circle" },
        { name: KEYS.drepDelegated, icon: "circle" },
        { name: KEYS.abstainDrep, icon: "circle" },
        { name: KEYS.noConfidenceDrep, icon: "circle" },
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
      formatter: function (params) {
        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        return (
          `${t("dreps.graphs.date")} ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("dreps.graphs.epoch")} ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const value =
                item.seriesName === KEYS.drepDelegated
                  ? formatNumber(item.data)
                  : formatLovelace(item.data);

              return `<p>${item.marker} ${tooltipLabels[item.seriesName]}: ${value}</p>`;
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
        name: KEYS.totalDelegatedStake,
        data: totalDelegatedStake,
        yAxisIndex: 0,
        itemStyle: { color: "#35c2f5" },
        showSymbol: false,
        z: 2,
      },
      {
        type: "line",
        name: KEYS.drepDelegated,
        data: totalDrepCount,
        yAxisIndex: 2,
        itemStyle: { color: textColor },
        showSymbol: false,
        z: 3,
      },
      {
        type: "line",
        name: KEYS.abstainDrep,
        data: alwaysAbstainDrep,
        yAxisIndex: 1,
        areaStyle: { opacity: 0.12 },
        itemStyle: { color: "#21fc1e" },
        showSymbol: false,
        z: 4,
      },
      {
        type: "line",
        name: KEYS.noConfidenceDrep,
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
