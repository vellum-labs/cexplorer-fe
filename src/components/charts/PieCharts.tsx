import EChartsReact from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { PIE_CHART_COLORS } from "@/constants/charts";
import { useMemo } from "react";

interface ChartConfig {
  dataKey: string;
  title: string;
  needsAdaFormatting?: boolean;
}

interface PieChartsProps<T> {
  items: T[];
  charts: ChartConfig[];
  getChartData: (items: T[], dataKey: string) => Array<Record<string, any>>;
}

export const PieCharts = <T,>({
  items,
  charts,
  getChartData,
}: PieChartsProps<T>) => {
  const { textColor, bgColor } = useGraphColors();

  const chartOptions = useMemo(() => {
    return charts.map(chart => {
      const chartData = getChartData(items, chart.dataKey);

      return {
        title: {
          text: chart.title,
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
          formatter: (params: any) => {
            if (chart.needsAdaFormatting) {
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
              value: item[chart.dataKey],
              name: item.name,
              itemStyle: { color: item.color },
            })),
          },
        ],
      };
    });
  }, [items, charts, getChartData, textColor, bgColor]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className='mb-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
      {chartOptions.map((option, index) => (
        <div key={charts[index].dataKey} className='w-full'>
          <EChartsReact
            option={option}
            style={{ height: "400px", width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
};
