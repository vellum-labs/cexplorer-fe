import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { FC } from "react";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useEffect, useState } from "react";
import { useFetchCombinedAverageDrep } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

export const AverageDrepGraph: FC = () => {
  const [graphsVisibility, setGraphsVisibility] = useState({
    "Average delegators per DRep": true,
    "Average stake per DRep (₳)": true,
    "Voting power (%) of DReps that are SPOs at the same time": true,
  });

  const query = useFetchCombinedAverageDrep();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const epochs = (query.data?.averageDrep ?? []).map(item => item.epoch_no);
  const avgDelegator = (query.data?.averageDrep ?? []).map(
    item => item.avg_delegator,
  );
  const avgEpochStake = (query.data?.averageDrep ?? []).map(
    item => item.avg_epoch_stake,
  );

  const votingPower = (query.data?.drepSpoSameTime ?? []).map(item =>
    item.delegator ? (item.count / item.delegator) * 100 : 0,
  );

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
      type: "scroll",
      data: [
        "Average delegators per DRep",
        "Average stake per DRep (₳)",
        "Voting power (%) of DReps that are SPOs at the same time",
      ],
      textStyle: { color: textColor },
      selected: Object.keys(graphsVisibility).reduce((acc, key) => {
        acc[key] = graphsVisibility[key];
        return acc;
      }, {}),
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: function (params) {
        const marker = dataPoint => dataPoint?.marker;

        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const formatMap = {
          "Average delegators per DRep": (item: any) =>
            item ? Math.round(item.data) : "N/A",
          "Average stake per DRep (₳)": (item: any) =>
            item ? lovelaceToAda(item.data) : "N/A",
          "Voting power (%) of DReps that are SPOs at the same time": (
            item: any,
          ) =>
            item && typeof item.data === "number"
              ? `${item.data.toFixed(2)}%`
              : "N/A",
        };

        const labelMap = {
          "Average delegators per DRep": "Average delegators per DRep",
          "Average stake per DRep (₳)": "Average stake per DRep",
          "Voting power (%) of DReps that are SPOs at the same time":
            "Voting power",
        };

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(
            endTime,
            "dd.MM.yy",
          )} (Epoch: ${params[0].axisValue})<hr>` +
          params
            .map(
              item =>
                `<p>${marker(item)} ${labelMap[item.seriesName]}: ${formatMap[item.seriesName](item)}</p>`,
            )
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
      name: "Epoch",
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      inverse: true,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        id: "0",
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        id: "1",
        offset: 0,
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: textColor } },
      },
      {
        type: "value",
        position: "right",
        offset: 60,
        id: "2",
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#FFA500" } },
      },
    ],
    series: [
      {
        type: "line",
        data: avgDelegator,
        name: "Average delegators per DRep",
        yAxisIndex: 0,
        lineStyle: { color: "#35c2f5" },
        itemStyle: { color: "#35c2f5" },
        showSymbol: false,
        symbol: "none",
        z: 2,
      },
      {
        type: "line",
        data: avgEpochStake,
        name: "Average stake per DRep (₳)",
        yAxisIndex: 1,
        lineStyle: { color: textColor },
        itemStyle: { color: textColor },
        showSymbol: false,
        symbol: "none",
        z: 1,
      },
      {
        type: "line",
        data: votingPower,
        name: "Voting power (%) of DReps that are SPOs at the same time",
        yAxisIndex: 2,
        lineStyle: { color: "#FFA500" },
        itemStyle: { color: "#FFA500" },
        showSymbol: false,
        symbol: "none",
        z: 1,
      },
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "localStorage" in window) {
      const stored = localStorage.getItem("average_drep_graph_store");
      if (stored) {
        setGraphsVisibility(JSON.parse(stored));
      } else {
        localStorage.setItem(
          "average_drep_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  return (
    <AnalyticsGraph title='Average DReps'>
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;
              localStorage.setItem(
                "average_drep_graph_store",
                JSON.stringify(selected),
              );
            },
          }}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
