import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import ReactEcharts from "echarts-for-react";
import { memo, useMemo, useRef } from "react";

interface Props {
  blocksInEpoch: number;
  blockCounts: number[];
  probabilities: number[];
}

const ExpectedBlocksGraph = memo(function ExpectedBlocksGraph({
  blocksInEpoch,
  blockCounts,
  probabilities,
}: Props) {
  const { textColor, bgColor, splitLineColor } = useGraphColors();

  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        confine: true,
        backgroundColor: bgColor,
        textStyle: {
          color: textColor,
        },
        formatter: function (params) {
          const value = params[0].value;
          const blocks = params[0].axisValue;
          return `Probability ${value}% ${blocks} Blocks`;
        },
      },
      grid: {
        top: 15,
        right: 50,
        bottom: 40,
        left: 52,
      },
      xAxis: {
        type: "category",
        data: blockCounts,
        inverse: false,
        name: "Expected Blocks",
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
          name: "Probability (%)",
          nameRotate: 90,
          nameLocation: "middle",
          nameGap: 40,
          id: "0",
          axisLabel: {
            color: textColor,
            formatter: value => `${value}%`,
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
          data: probabilities,
          type: "bar",
          name: "Probability",
          itemStyle: {
            opacity: 0.7,
            color: params => {
              if (+params.name === Math.round(blocksInEpoch)) {
                return "#00ff00";
              }

              return "#e3033a";
            },
          },
        },
      ],
    }),
    [
      bgColor,
      textColor,
      splitLineColor,
      blockCounts,
      probabilities,
      blocksInEpoch,
    ],
  );

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 250 }}
        onChartReady={onChartReadyCallback}
        loadingOption={{
          text: "",
          color: "#e3033a",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 0.8)",
        }}
        option={option}
        notMerge={true}
        className='h-full min-h-[200px] w-full'
      />
    </div>
  );
});

export default ExpectedBlocksGraph;
