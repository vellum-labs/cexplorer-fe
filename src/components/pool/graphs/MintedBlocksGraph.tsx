import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
import ReactEcharts from "echarts-for-react";
import { memo, useMemo, useRef } from "react";

interface Props {
  mintedBlocks: number[];
  txCount: number[];
  dates: string[];
}

const MintedBlocksGraph = memo(function MintedBlocksGraph({
  mintedBlocks,
  txCount,
  dates,
}: Props) {
  const { bgColor, lineColor, splitLineColor, textColor } = useGraphColors();

  const chartRef = useRef(null);

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  const option: ReactEChartsProps["option"] = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        confine: true,
        backgroundColor: bgColor,
        textStyle: {
          color: textColor,
        },
      },
      grid: {
        top: 15,
        right: 50,
        bottom: 40,
        left: 50,
      },
      xAxis: {
        type: "category",
        data: dates,
        name: "Day",
        nameLocation: "middle",
        nameGap: 28,
        axisLabel: {
          color: textColor,
          formatter: value => value.slice(0, value.lastIndexOf(".") + 1),
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
          name: "Blocks",
          nameRotate: 90,
          nameLocation: "middle",
          nameGap: 35,
          id: "0",
          axisLabel: {
            color: textColor,
            formatter: (value: any) => {
              return formatNumberWithSuffix(value, true);
            },
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
          show: true,
          name: "Avg TX Count",
          nameRotate: 90,
          nameLocation: "middle",
          nameGap: 35,
          id: "1",
          axisLabel: {
            color: textColor,
            formatter: (value: any) => {
              return formatNumberWithSuffix(value, true);
            },
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
          data: mintedBlocks,
          type: "bar",
          name: "Blocks",
          itemStyle: {
            opacity: 0.7,
            color: "#e3033a",
          },
        },
        {
          data: txCount,
          type: "line",
          name: "Avg TX Count",
          lineStyle: {
            color: lineColor,
          },
          showSymbol: false,
          yAxisIndex: 1,
          areaStyle: {
            opacity: 0.2,
            color: lineColor,
          },
          itemStyle: {
            color: lineColor,
          },
        },
      ],
    }),
    [
      bgColor,
      textColor,
      splitLineColor,
      lineColor,
      dates,
      mintedBlocks,
      txCount,
    ],
  );

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 250 }}
        onChartReady={onChartReadyCallback}
        option={option}
        notMerge={true}
        className='h-full min-h-[200px] w-full'
      />
    </div>
  );
});

export default MintedBlocksGraph;
