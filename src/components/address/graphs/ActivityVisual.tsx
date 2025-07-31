import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useThemeStore } from "@/stores/themeStore";
import ReactEcharts from "echarts-for-react";

const ActivityVisual = ({ count }: { count: number }) => {
  const { theme } = useThemeStore();
  const color = theme === "dark" ? "#79defd" : "#0094d4";
  const options: ReactEChartsProps["option"] = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "110%",
        min: 0,
        max: 100,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0, "#ff0000"],
              [1, color],
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "15%",
          width: 8,
          offsetCenter: [0, "-56%"],
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          length: 0,
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          length: 0,
          show: false,
        },
        detail: {
          fontSize: 7,
          offsetCenter: [0, "-15%"],
          valueAnimation: true,
          color: "inherit",
          formatter: function () {
            return (
              Math.min(100, Math.round(Math.min(100, count / 300) * 100)) + "%"
            );
          },
        },
        data: [
          {
            value: Math.round(Math.min(100, count / 300) * 100),
          },
        ],
      },
    ],
  };

  return (
    <ReactEcharts
      className='max-h-[20px] max-w-[70px] -translate-y-[12px]'
      opts={{
        height: 42,
      }}
      option={options}
    />
  );
};

export default ActivityVisual;
