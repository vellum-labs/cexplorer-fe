import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { FC } from "react";
import { GraphTimePeriod } from "@/types/graphTypes";
import type { AveragePool as AveragePoolData } from "@/types/analyticsTypes";

import { AnalyticsGraph } from "../../AnalyticsGraph";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useEffect, useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchAveragePool } from "@/services/analytics";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const AveragePool: FC = () => {
  const { t } = useAppTranslation("common");
  const [selectedItem, setSelectedItem] = useState<GraphTimePeriod>(
    GraphTimePeriod.ThirtyDays,
  );

  const [data, setData] = useState<AveragePoolData[]>();
  const [json, setJson] = useState<any>();
  const [graphsVisibility, setGraphsVisibility] = useState({
    "Average delegators per pool": true,
    "Average stake per pool": true,
  });

  const query = useFetchAveragePool();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const epochs = (data ?? []).map(item => item.epoch_no);
  const avgDelegator = (data ?? []).map(item => item.avg_delegator);
  const avgEpochStake = (data ?? []).map(
    item => item.avg_epoch_stake / 1_000_000,
  );

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: ["Average delegators per pool", "Average stake per pool"],
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
          "Average delegators per pool": item =>
            item ? Math.round(item?.data) : "Average delegators",
          "Average stake per pool": item =>
            item
              ? `${formatNumber(Number(item.data.toFixed(0)))}`
              : "Average stake (₳)",
        };

        return (
          `${t("labels.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("labels.epoch")}: ${params[0].axisValue})<hr>` +
          `<div>
        ${params
          .map(
            item =>
              `<p>${marker(item)} ${nameFunc[item?.seriesName]?.()}: ${nameFunc[item?.seriesName]?.(item)}</p>`,
          )
          .join("")}
      </div>`
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
        data: avgDelegator,
        name: "Average delegators per pool",
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
        data: avgEpochStake,
        name: "Average stake per pool",
        yAxisIndex: 1,
        lineStyle: {
          color: textColor,
        },
        showSymbol: false,
        symbol: "none",
        z: 1,
      },
    ],
  };

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("average_pool_graph_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "average_pool_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  useEffect(() => {
    if (setJson) {
      setJson(
        epochs.map((epoch, index) => {
          return {
            Epoch: epoch,
            "Average delegators per pool": avgDelegator[index],
            "Average stake per pool": avgEpochStake[index],
          };
        }),
      );
    }
  }, [data]);

  return (
    <AnalyticsGraph
      title={t("analytics.averagePools")}
      exportButton
      graphSortData={{
        query,
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
                "average_pool_graph_store",
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
