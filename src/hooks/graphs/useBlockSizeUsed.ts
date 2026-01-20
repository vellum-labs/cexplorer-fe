import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { Dispatch, SetStateAction } from "react";

import { GraphTimePeriod } from "@/types/graphTypes";

import { useEffect, useState } from "react";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import type { MiscConstResponseData } from "@/types/miscTypes";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface UseBlockSizeUsed {
  json: any;
  option: ReactEChartsProps["option"];
  selectedItem: GraphTimePeriod;
  setData: Dispatch<SetStateAction<EpochAnalyticsResponseData[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
}

export const useBlockSizeUsed = (
  miscConst: MiscConstResponseData | undefined,
): UseBlockSizeUsed => {
  const { t } = useAppTranslation("pages");
  const [json, setJson] = useState<any>();
  const [data, setData] = useState<EpochAnalyticsResponseData[]>();

  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const { splitLineColor, textColor, bgColor } = useGraphColors();

  const blockSizeLabel = t("analytics.graph.blockSize");

  const epochs = (data || []).map(item => item.no).reverse();

  const blocks = (data || [])
    .map(item => ((item?.stat?.avg_block_size ?? 0) as number) / 1024)
    .reverse();

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
      nameGap: 40,
      axisLabel: {
        color: textColor,
        formatter: "{value} Kb",
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
        name: blockSizeLabel,
        data: blocks,
        type: "bar",
        itemStyle: {
          color: "#e3033a",
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

        const formatValue = item =>
          item ? `${formatNumber(item.data.toFixed(2))} Kb` : blockSizeLabel;

        return (
          `${t("epochs.graph.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("epochs.graph.epoch")}: ${params[0].axisValue})<hr>` +
          `<div>
            ${params
              .map(
                item =>
                  `<p>${marker(item)} ${item.seriesName}: ${formatValue(item)}</p>`,
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
          "Block Size": blocks[index],
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
