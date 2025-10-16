import ReactECharts from "echarts-for-react";
import type { FC } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";

interface PriceSparklineProps {
  data: Array<{ date: string; close: number }>;
  width?: number;
  height?: number;
}

export const PriceSparkline: FC<PriceSparklineProps> = ({
  data,
  width = 120,
  height = 40,
}) => {
  const { bgColor, textColor } = useGraphColors();

  if (!data || data.length === 0) {
    return <span className='text-text-xs text-grayTextPrimary'>-</span>;
  }

  const reversedData = [...data].reverse();
  const prices = reversedData.map(item => item.close);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isPositive = lastPrice >= firstPrice;

  const option = {
    animation: false,
    grid: {
      left: 0,
      right: 0,
      top: 2,
      bottom: 2,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      borderColor: isPositive ? "#10B981" : "#EF4444",
      borderWidth: 1,
      axisPointer: {
        type: "line",
        lineStyle: {
          color: isPositive ? "#10B981" : "#EF4444",
          width: 1,
        },
      },
      formatter: (params: any) => {
        const dataPoint = params[0];
        const fullPrice = dataPoint.value.toFixed(10).replace(/\.?0+$/, "");
        return `${dataPoint.name}<br/>₳ ${fullPrice}`;
      },
    },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false,
      data: reversedData.map(d => d.date),
    },
    yAxis: {
      type: "value",
      show: false,
      scale: true,
      min: "dataMin",
      max: "dataMax",
    },
    series: [
      {
        data: prices,
        type: "line",
        smooth: 0.3,
        symbol: "none",
        lineStyle: {
          color: isPositive ? "#10B981" : "#EF4444",
          width: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: isPositive
                  ? "rgba(16, 185, 129, 0.4)"
                  : "rgba(239, 68, 68, 0.4)",
              },
              {
                offset: 1,
                color: isPositive
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
              },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className='flex items-center justify-center'>
      <ReactECharts
        option={option}
        style={{ width: `${width}px`, height: `${height}px` }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};
