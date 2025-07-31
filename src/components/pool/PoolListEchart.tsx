import type { ReactEChartsProps } from "@/lib/ReactCharts";
import ReactECharts from "@/lib/ReactCharts";

import type { RefObject } from "react";
import { forwardRef, useRef } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { cn } from "@/lib/utils";

interface PoolListEchartProps {
  dataSource: any;
  toolTipFormatter: (params: { dataIndex: number }) => string;
  color: (params: { dataIndex: number }) => string;
  className?: string;
}

export const PoolListEchart = forwardRef<HTMLDivElement, PoolListEchartProps>(
  ({ dataSource, toolTipFormatter, color, className }, ref) => {
    const { theme } = useThemeStore();

    const tooltipRef = useRef<HTMLDivElement>(null);

    const maxMinted = Math.max(...dataSource.map(d => d[1]));

    const option: ReactEChartsProps["option"] = {
      dataset: {
        source: dataSource,
      },
      grid: {
        left: "0%",
        right: "0%",
        bottom: "0%",
        top: "0%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        inverse: true,
      },
      yAxis: {
        min: 0,
        max: maxMinted,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          type: "bar",
          barWidth: "100%",
          barMinHeight: 2,
          itemStyle: {
            color,
          },
        },
      ],

      tooltip: {
        trigger: "item",
        confine: true,
        formatter: toolTipFormatter as any,
        borderWidth: 0,
        padding: 6,
        backgroundColor: theme === "light" ? "#fff" : "#252933",
        textStyle: {
          width: 40,
          color: theme === "light" ? "#475467" : "#fff",
        },

        position: (_params, _object, _dom, _rect, size) => {
          if (
            !tooltipRef.current ||
            !ref ||
            !(ref as RefObject<HTMLDivElement>).current
          )
            return "right";

          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const tableRect = (
            ref as RefObject<HTMLDivElement>
          ).current!.getBoundingClientRect();

          const spaceTop = tooltipRect.top - tableRect.top;

          if (spaceTop < size.contentSize[0]) {
            return "bottom";
          } else {
            return "top";
          }
        },
      },
    };

    return (
      <div className={cn("flex", className && className)} ref={tooltipRef}>
        <ReactECharts option={option} className='h-[12px] w-[24px] text-end' />
      </div>
    );
  },
);
