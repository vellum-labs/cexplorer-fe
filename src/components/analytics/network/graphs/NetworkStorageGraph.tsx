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

import { bytesPerMb } from "@/constants/memorySizes";
import { GraphTimePeriod } from "@/types/graphTypes";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { configJSON } from "@/constants/conf";
interface NetworkStorageGraphProps {
  epochQuery: ReturnType<typeof useFetchEpochAnalytics>;
  miscConst: MiscConstResponseData | undefined;
}

export const NetworkStorageGraph: FC<NetworkStorageGraphProps> = ({
  epochQuery,
  miscConst,
}) => {
  const { genesisParams } = configJSON;
  const { shelley } = genesisParams[0];
  const { shelleyStartEpoch } = shelley[0];

  const [json, setJson] = useState<any>();

  const [data, setData] = useState<EpochAnalyticsResponseData[]>();
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const allTime = epochQuery.data?.data.slice(
    0,
    epochQuery.data?.data.length - shelleyStartEpoch,
  );

  const [graphsVisibility, setGraphsVisibility] = useState({
    "Storage Increase (MB)": true,
    "Storage Total (MB)": true,
  });

  const epochs = (data ?? []).map(item => item?.no);

  const storageIncreaseMap = new Map<number, number>();
  const storageTotalMap = new Map<number, number>();

  (allTime ?? []).forEach(item => {
    const countBlk = (item?.stat?.count_block ?? 0) as number;
    const avgBlkSize = (item?.stat?.avg_block_size ?? 0) as number;
    const currentTotal = countBlk * avgBlkSize;

    storageIncreaseMap.set(item?.no, currentTotal / bytesPerMb);
  });

  const sortedAllTime = [...(allTime ?? [])].sort((a, b) => a.no - b.no);

  let accumulatedTotal = 0;
  sortedAllTime.forEach(item => {
    const countBlk = (item?.stat?.count_block ?? 0) as number;
    const avgBlkSize = (item?.stat?.avg_block_size ?? 0) as number;
    const currentTotal = countBlk * avgBlkSize;

    accumulatedTotal += currentTotal;
    storageTotalMap.set(item?.no, accumulatedTotal / bytesPerMb);
  });

  const storageIncreaseData = epochs.map(epochNo =>
    (storageIncreaseMap.get(epochNo) ?? 0).toFixed(2),
  );

  const storageTotalData = epochs.map(epochNo =>
    (storageTotalMap.get(epochNo) ?? 0).toFixed(2),
  );

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
      data: [
        {
          name: "Storage Increase (MB)",
          icon: "rect",
        },
        {
          name: "Storage Total (MB)",
          icon: "rect",
        },
      ],
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
          "Storage Increase (MB)": item =>
            item ? `${Number(item.data).toFixed(2)} MB` : "Storage Increase",
          "Storage Total (MB)": item =>
            item ? `${Number(item.data).toFixed(2)} MB` : "Storage Total",
        };

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0].axisValue})<hr>` +
          `<div>
        ${params
          .map(
            item =>
              `<p>${marker(item)} ${item.seriesName}: ${nameFunc[item.seriesName]?.(item)}</p>`,
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
      name: "Epoch",
      nameLocation: "middle",
      nameGap: 28,
      inverse: true,
      boundaryGap: false,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        show: true,
        nameRotate: 90,
        nameLocation: "middle",
        nameGap: 5,
        id: "0",
        axisLabel: {
          show: false,
          color: textColor,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
      },
      {
        type: "value",
        position: "right",
        id: "1",
        show: false,
        axisLabel: {
          color: textColor,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
      },
    ],
    series: [
      {
        type: "line",
        data: storageIncreaseData,
        name: "Storage Increase (MB)",
        yAxisIndex: 0,
        lineStyle: {
          color: "#35c2f5",
        },
        showSymbol: false,
        symbol: "none",
        z: 2,
      },
      {
        type: "line",
        data: storageTotalData,
        name: "Storage Total (MB)",
        yAxisIndex: 1,
        lineStyle: {
          color: "#22c55e",
        },
        showSymbol: false,
        symbol: "none",
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
            "Storage Increase (MB)": storageIncreaseData[index],
            "Storage Total (MB)": storageTotalData[index],
          };
        }),
      );
    }
  }, [data]);

  return (
    <AnalyticsGraph
      title='Network storage in time'
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
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;
              setGraphsVisibility(selected);
            },
          }}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
