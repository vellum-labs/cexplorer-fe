import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { Dispatch, SetStateAction } from "react";

import { GraphTimePeriod } from "@/types/graphTypes";
import { useGraphColors } from "@/hooks/useGraphColors";

import { useEffect, useState } from "react";
import { calculateMovingAverage } from "@/utils/calculateMovingAverage";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import type { MiscConstResponseData } from "@/types/miscTypes";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface UseBlockProduction {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setData: Dispatch<SetStateAction<EpochAnalyticsResponseData[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
}

export const useBlockProduction = (
  miscConst: MiscConstResponseData | undefined,
): UseBlockProduction => {
  const { t } = useAppTranslation("pages");
  const [json, setJson] = useState<any>();
  const [data, setData] = useState<EpochAnalyticsResponseData[]>();

  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );
  const { splitLineColor, textColor, bgColor } = useGraphColors();

  const graphLabels = {
    blocks: t("analytics.graph.blocks"),
    movingAverage: t("analytics.graph.movingAverage"),
  };

  const epochs = (data || []).map(item => item.no).reverse();

  const blocksData = (data || []).map(item => item?.stat?.count_block ?? 0);

  const movingAverageBlocksData = calculateMovingAverage(blocksData, 5);

  const blocks = blocksData.slice().reverse();
  const movingAverageBlocks = movingAverageBlocksData.slice().reverse();

  const option: ReactEChartsProps["option"] = {
    grid: {
      left: "5px",
      right: "5px",
      top: "15px",
      bottom: "15px",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: epochs,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: textColor,
        formatter: "{value}",
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
        name: graphLabels.blocks,
        data: blocks,
        type: "bar",
        itemStyle: {
          color: "#e3033a",
        },
      },
      {
        name: graphLabels.movingAverage,
        data: movingAverageBlocks,
        type: "line",
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: "#00bfff",
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: bgColor,
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
          [graphLabels.blocks]: item => (item ? `${formatNumber(item.value)}` : graphLabels.blocks),
          [graphLabels.movingAverage]: item =>
            item ? `${formatNumber(item.value.toFixed(2))}` : graphLabels.movingAverage,
        };

        return (
          `${t("epochs.graph.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("epochs.graph.epoch")}: ${params[0].axisValue})<hr>` +
          `<div>
        ${params
          .map(
            item =>
              `<p>${marker(item)} ${item.seriesName || graphLabels.blocks}: ${nameFunc[item.seriesName || graphLabels.blocks]?.(item) ?? formatNumber(item.value)}</p>`,
          )
          .join("")}
      </div>`
        );
      },
    },
  };

  useEffect(() => {
    if (setJson) {
      setJson(
        epochs.map((epoch, index) => ({
          Epoch: epoch,
          Blocks: blocks[index],
        })),
      );
    }
  }, [data]);

  return {
    json,
    option,
    selectedItem,
    setData,
    setSelectedItem,
  };
};
