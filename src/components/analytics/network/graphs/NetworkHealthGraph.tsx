import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { useFetchEpochAnalytics } from "@/services/analytics";
import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { MiscConstResponseData } from "@/types/miscTypes";
import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";
import { AnalyticsGraph } from "../../AnalyticsGraph";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useEffect, useState } from "react";

import { GraphTimePeriod } from "@/types/graphTypes";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { configJSON } from "@/constants/conf";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface NetworkHealthGraphProps {
  epochQuery: ReturnType<typeof useFetchEpochAnalytics>;
  miscConst: MiscConstResponseData | undefined;
}

export const NetworkHealthGraph: FC<NetworkHealthGraphProps> = ({
  epochQuery,
  miscConst,
}) => {
  const { t } = useAppTranslation("common");
  const [json, setJson] = useState<any>();

  const { genesisParams } = configJSON;

  const epochDays = genesisParams[0].shelley[0].epochLength / 86400;
  const expectedBlocks =
    genesisParams[0].shelley[0].activeSlotsCoeff *
    genesisParams[0].shelley[0].epochLength;

  const [data, setData] = useState<EpochAnalyticsResponseData[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const [graphsVisibility, setGraphsVisibility] = useState(() => {
    try {
      const stored = localStorage.getItem("network_chain_density_graph_store");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.log(e);
    }
    return {
      "Real Chain Density": true,
      "Optimal Chain Density": true,
    };
  });

  const epochs = (data ?? []).map(item => item?.no);
  const realChainDensity = (data ?? []).map(
    item =>
      (((item?.stat?.count_block ?? 0) as number) /
        expectedBlocks /
        epochDays) *
      100,
  );
  const optimalChainDensity = (data ?? []).map(() => {
    return genesisParams[0].shelley[0].activeSlotsCoeff * 100;
  });

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: ["Real Chain Density", "Optimal Chain Density"],
      textStyle: {
        color: textColor,
      },
      selected: Object.keys(graphsVisibility).reduce((acc, key) => {
        acc[key] = graphsVisibility[key];
        return acc;
      }, {}),
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      confine: true,
      textStyle: {
        color: textColor,
      },
      formatter: function (params) {
        const marker = dataPoint => dataPoint?.marker;

        const { endTime, startTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const nameFunc = {
          "Real Chain Density": item =>
            item ? `${item.data.toFixed(2)} %` : "Real Chain Density",
          "Optimal Chain Density": item =>
            item ? `${item.data.toFixed(2)} %` : "Optimal Chain Density",
        };

        return (
          `${t("labels.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("labels.epoch")}: ${params[0].axisValue})<hr>` +
          `<div>
        ${params
          .map(
            item =>
              `<p>${marker(item)} ${item.seriesName}: ${nameFunc[item.seriesName](item)}</p>`,
          )
          .join("")}
      </div>`
        );
      },
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: epochs,
      name: t("labels.epoch"),
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      inverse: true,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Density",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: {
        color: textColor,
        formatter: "{value} %",
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor,
        },
      },
    },
    series: [
      {
        type: "line",
        data: realChainDensity,
        name: "Real Chain Density",
        yAxisIndex: 0,
        lineStyle: {
          color: "#e3033a",
        },
        showSymbol: false,
        z: 2,
      },
      {
        type: "line",
        data: optimalChainDensity,
        name: "Optimal Chain Density",
        yAxisIndex: 0,
        lineStyle: {
          color: "#21fc1e",
          type: "dashed",
        },
        showSymbol: false,
        z: 1,
      },
    ],
  };

  useEffect(() => {
    if (setJson) {
      setJson(
        epochs.map((epoch, index) => {
          return {
            Epoch: epoch,
            "Real Chain Density": realChainDensity[index],
            "Optimal Chain Density": optimalChainDensity[index],
          };
        }),
      );
    }
  }, [data]);

  return (
    <AnalyticsGraph
      title={t("analytics.chainDensity")}
      description={t("analytics.chainDensityDescription")}
      exportButton
      graphSortData={{
        query: epochQuery,
        setData,
        setSelectedItem,
        selectedItem,
        ignoreFiveDays: true,
      }}
      csvJson={json}
    >
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;

              localStorage.setItem(
                "network_chain_density_graph_store",
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
