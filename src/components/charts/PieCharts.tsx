import EChartsReact from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useMemo } from "react";
import { PIE_CHART_COLORS } from "@/constants/charts";

interface ChartConfig {
  dataKey: string;
  title: string;
  needsAdaFormatting?: boolean;
}

interface PieChartsProps<T> {
  items: T[];
  charts: ChartConfig[];
  getChartData: (items: T[]) => Array<Record<string, any>>;
}

export const PieCharts = <T,>({
  items,
  charts,
  getChartData,
}: PieChartsProps<T>) => {
  const { textColor, bgColor } = useGraphColors();

  const chartData = useMemo(() => getChartData(items), [items, getChartData]);

  const getChartOption = (
    dataKey: string,
    title: string,
    needsAdaFormatting = false,
  ) => {
    return {
      title: {
        text: title,
        left: "center",
        textStyle: {
          color: textColor,
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: bgColor,
        textStyle: {
          color: textColor,
        },
        formatter: params => {
          if (needsAdaFormatting) {
            const adaValue = formatNumber(Math.round(params.value / 1000000));
            return `${params.name}<br/>${params.marker}${adaValue} ₳`;
          }
          return `${params.name}<br/>${params.marker}${formatNumber(params.value)}`;
        },
      },
      color: PIE_CHART_COLORS,
      series: [
        {
          type: "pie",
          radius: ["50%", "80%"],
          avoidLabelOverlap: true,
          minShowLabelAngle: 10,
          label: {
            show: true,
            color: textColor,
            position: "outside",
            fontSize: 10,
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            lineStyle: {
              width: 1,
            },
          },
          emphasis: {
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          data: chartData.map(item => ({
            value: item[dataKey],
            name: item.name,
            itemStyle: { color: item.color },
          })),
        },
      ],
    };
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className='mb-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
      {charts.map(chart => (
        <div key={chart.dataKey} className='w-full'>
          <EChartsReact
            option={getChartOption(
              chart.dataKey,
              chart.title,
              chart.needsAdaFormatting,
            )}
            style={{ height: "400px", width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
};
