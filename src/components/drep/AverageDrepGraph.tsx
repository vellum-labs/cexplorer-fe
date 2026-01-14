import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { FC } from "react";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useEffect, useState } from "react";
import { useFetchCombinedAverageDrep } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const AverageDrepGraph: FC = () => {
  const { t } = useAppTranslation("pages");

  const KEYS = {
    avgDelegators: "avgDelegators",
    avgStake: "avgStake",
    votingPower: "votingPower",
  };

  const [graphsVisibility, setGraphsVisibility] = useState({
    [KEYS.avgDelegators]: true,
    [KEYS.avgStake]: true,
    [KEYS.votingPower]: true,
  });

  const query = useFetchCombinedAverageDrep();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

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

  const legendLabels = {
    [KEYS.avgDelegators]: t("dreps.graphs.averageDreps.avgDelegatorsPerDrep"),
    [KEYS.avgStake]: t("dreps.graphs.averageDreps.avgStakePerDrep"),
    [KEYS.votingPower]: t("dreps.graphs.averageDreps.votingPowerSpoSameTime"),
  };

  const tooltipLabels = {
    [KEYS.avgDelegators]: t("dreps.graphs.averageDreps.avgDelegatorsPerDrep"),
    [KEYS.avgStake]: t("dreps.graphs.averageDreps.avgStakePerDrepShort"),
    [KEYS.votingPower]: t("dreps.graphs.averageDreps.votingPowerShort"),
  };

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
      type: "scroll",
      data: [
        { name: KEYS.avgDelegators, icon: "circle" },
        { name: KEYS.avgStake, icon: "circle" },
        { name: KEYS.votingPower, icon: "circle" },
      ],
      formatter: (name: string) => legendLabels[name] || name,
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
          [KEYS.avgDelegators]: (item: any) =>
            item ? Math.round(item.data) : "N/A",
          [KEYS.avgStake]: (item: any) =>
            item ? formatLovelace(item.data) : "N/A",
          [KEYS.votingPower]: (item: any) =>
            item && typeof item.data === "number"
              ? `${item.data.toFixed(2)}%`
              : "N/A",
        };

        return (
          `${t("dreps.graphs.date")} ${format(startTime, "dd.MM.yy")} - ${format(
            endTime,
            "dd.MM.yy",
          )} (${t("dreps.graphs.epoch")} ${params[0].axisValue})<hr>` +
          params
            .map(
              item =>
                `<p>${marker(item)} ${tooltipLabels[item.seriesName]}: ${formatMap[item.seriesName](item)}</p>`,
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
      name: t("common:labels.epoch"),
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
        name: KEYS.avgDelegators,
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
        name: KEYS.avgStake,
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
        name: KEYS.votingPower,
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
    <AnalyticsGraph title={t("dreps.graphs.averageDreps.title")}>
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
