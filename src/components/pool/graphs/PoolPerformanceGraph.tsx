import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchMiscBasic } from "@/services/misc";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { format } from "date-fns";
import ReactEcharts from "echarts-for-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";

interface Props {
  epochs: number[];
  delegators: number[];
  luck: number[];
  blocks: number[];
  activeStake: number[];
  pledged: number[];
  roa: number[];
}

const PoolPerformanceGraph = memo(function PoolPerformanceGraphMemo({
  activeStake,
  blocks,
  delegators,
  epochs,
  luck,
  pledged,
  roa,
}: Props) {
  const [graphsVisibility, setGraphsVisibility] = useState({
    Delegators: true,
    "Luck (%)": true,
    Blocks: true,
    "Epoch Stake": true,
    "ROA (%)": true,
    Pledged: true,
  });
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);
  const { textColor, bgColor, splitLineColor, inactivePageIconColor } =
    useGraphColors();

  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const option: ReactEChartsProps["option"] = useMemo(() => {
    return {
      legend: {
        pageIconColor: textColor,
        pageIconInactiveColor: inactivePageIconColor,
        pageTextStyle: {
          color: textColor,
        },
        type: "scroll",
        data: [
          "Delegators",
          "Luck (%)",
          "Blocks",
          "Epoch Stake",
          "ROA (%)",
          "Pledged",
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
          if (!params || params.length === 0) return "";

          const marker = dataPoint => dataPoint?.marker || "";

          const { endTime, startTime } = calculateEpochTimeByNumber(
            +params[0]?.axisValue,
            miscConst?.epoch.no ?? 0,
            miscConst?.epoch.start_time ?? "",
          );

          const valueFormatter = (
            name: string,
            value: number | null | undefined,
          ) => {
            if (value == null || isNaN(Number(value))) return "—";

            switch (name) {
              case "ROA (%)":
              case "Luck (%)":
                return `${Number(value).toFixed(2)}`;
              case "Pledged":
              case "Epoch Stake":
                return lovelaceToAda(Number(value));
              case "Delegators":
              case "Blocks":
              default:
                return formatNumber(value);
            }
          };

          return (
            `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0].axisValue})<hr>` +
            `<div>
      ${params
        .map(item => {
          const formattedValue = valueFormatter(item.seriesName, item.data);
          return `<p style="margin: 2px 0;">${marker(item)} ${item.seriesName}: ${formattedValue}</p>`;
        })
        .join("")}
    </div>`
          );
        },
      },
      grid: {
        top: 40,
        right: 5,
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
          name: "Amount",
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
        {
          type: "value",
          position: "left",
          show: false,
          id: "2",
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
          id: "3",
          show: false,
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
          id: "4",
          show: false,
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
      ],
      series: [
        {
          type: "line",
          data: delegators,
          name: "Delegators",
          yAxisIndex: 0,
          itemStyle: {
            color: "#35c2f5",
          },
          showSymbol: false,
          z: 2,
        },
        {
          type: "bar",
          data: luck,
          name: "Luck (%)",
          yAxisIndex: 3,
          itemStyle: {
            color: "rgba(145, 145, 145, 0.5)",
          },
          z: 1,
        },
        {
          type: "line",
          data: blocks,
          name: "Blocks",
          yAxisIndex: 2,
          itemStyle: {
            color: textColor,
          },
          showSymbol: false,
          z: 3,
        },
        {
          type: "line",
          areaStyle: {
            opacity: 0.12,
          },
          data: activeStake,
          name: "Epoch Stake",
          yAxisIndex: 1,
          itemStyle: {
            color: "#21fc1e",
          },
          showSymbol: false,
          z: 4,
        },
        {
          type: "line",
          data: [null, null, ...roa.slice(2)],
          name: "ROA (%)",
          yAxisIndex: 4,
          areaStyle: {
            opacity: 0.12,
          },
          itemStyle: {
            color: "#ffc115",
          },
          showSymbol: false,
          markArea: {
            silent: true,
            itemStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            data: [
              [
                { xAxis: epochs[epochs.length - 2] },
                { xAxis: epochs[epochs.length - 1] },
              ],
            ],
          },
          z: 5,
        },
        {
          type: "line",
          data: pledged,
          name: "Pledged",
          yAxisIndex: 2,
          areaStyle: {
            opacity: 0.12,
          },
          showSymbol: false,
          itemStyle: {
            color: "#da16e8",
          },
          z: 6,
        },
      ],
    };
  }, [
    textColor,
    bgColor,
    splitLineColor,
    inactivePageIconColor,
    graphsVisibility,
    delegators,
    luck,
    blocks,
    activeStake,
    roa,
    pledged,
    epochs,
  ]);

  const onEvents = useMemo(
    () => ({
      legendselectchanged: params => {
        const { selected } = params;

        setGraphsVisibility(selected);

        localStorage.setItem(
          "pool_performance_graph_store",
          JSON.stringify(selected),
        );
      },
    }),
    [],
  );

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("pool_performance_graph_store") as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "pool_performance_graph_store",
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
        onEvents={onEvents}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='h-full min-h-[400px] w-full'
      />
    </div>
  );
});

export default PoolPerformanceGraph;
