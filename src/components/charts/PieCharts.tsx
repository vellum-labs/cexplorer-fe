import EChartsReact from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { PIE_CHART_COLORS } from "@/constants/charts";
import { colors } from "@/constants/colors";
import { useMemo } from "react";

interface ChartConfig {
  dataKey: string;
  title: string;
  needsAdaFormatting?: boolean;
}

interface GroupedItem {
  name: string;
  value: number;
  color: string;
  isOthers?: boolean;
  groupedItems?: Array<{ name: string; value: number }>;
}

interface TooltipTranslations {
  others: string;
  items: string;
  total: string;
  andMore: (count: number) => string;
}

interface PieChartsProps<T> {
  items: T[];
  charts: ChartConfig[];
  getChartData: (items: T[], dataKey: string) => Array<Record<string, any>>;
  minThreshold?: number;
  tooltipTranslations?: TooltipTranslations;
}

const defaultTooltipTranslations: TooltipTranslations = {
  others: "Others",
  items: "items",
  total: "Total",
  andMore: (count: number) => `and ${count} more`,
};

export const PieCharts = <T,>({
  items,
  charts,
  getChartData,
  minThreshold = 0.5,
  tooltipTranslations = defaultTooltipTranslations,
}: PieChartsProps<T>) => {
  const { textColor, bgColor } = useGraphColors();

  const chartOptions = useMemo(() => {
    return charts.map(chart => {
      const chartData = getChartData(items, chart.dataKey);

      const total = chartData.reduce(
        (sum, item) => sum + (item[chart.dataKey] ?? 0),
        0,
      );

      const thresholdValue = (minThreshold / 100) * total;

      const mainItems: GroupedItem[] = [];
      const smallItems: Array<{ name: string; value: number }> = [];

      chartData.forEach(item => {
        const value = item[chart.dataKey] ?? 0;
        if (value >= thresholdValue) {
          mainItems.push({
            name: item.name,
            value: value,
            color: item.color,
          });
        } else {
          smallItems.push({
            name: item.name,
            value: value,
          });
        }
      });

      if (smallItems.length > 0) {
        const othersValue = smallItems.reduce(
          (sum, item) => sum + item.value,
          0,
        );
        mainItems.push({
          name: tooltipTranslations.others,
          value: othersValue,
          color: colors.othersGray,
          isOthers: true,
          groupedItems: smallItems.sort((a, b) => b.value - a.value),
        });
      }

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
            const dataItem = mainItems.find(item => item.name === params.name);

            if (dataItem?.isOthers && dataItem.groupedItems) {
              const percentage = ((params.value / total) * 100).toFixed(1);
              let tooltipContent = `<strong>${tooltipTranslations.others} (${dataItem.groupedItems.length} ${tooltipTranslations.items})</strong><br/>`;
              tooltipContent += `${params.marker}${tooltipTranslations.total}: ${chart.needsAdaFormatting ? formatNumber(Math.round(params.value / 1000000)) + " ₳" : formatNumber(params.value)} (${percentage}%)<br/><br/>`;

              const maxItemsToShow = 15;
              const itemsToShow = dataItem.groupedItems.slice(
                0,
                maxItemsToShow,
              );

              itemsToShow.forEach(item => {
                const itemPercentage = ((item.value / total) * 100).toFixed(2);
                const formattedValue = chart.needsAdaFormatting
                  ? formatNumber(Math.round(item.value / 1000000)) + " ₳"
                  : formatNumber(item.value);
                tooltipContent += `${item.name}: ${formattedValue} (${itemPercentage}%)<br/>`;
              });

              if (dataItem.groupedItems.length > maxItemsToShow) {
                tooltipContent += `<br/>... ${tooltipTranslations.andMore(dataItem.groupedItems.length - maxItemsToShow)}`;
              }

              return tooltipContent;
            }

            const percentage = ((params.value / total) * 100).toFixed(1);
            if (chart.needsAdaFormatting) {
              const adaValue = formatNumber(Math.round(params.value / 1000000));
              return `${params.name}<br/>${params.marker}${adaValue} ₳ (${percentage}%)`;
            }
            return `${params.name}<br/>${params.marker}${formatNumber(params.value)} (${percentage}%)`;
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
            data: mainItems.map(item => ({
              value: item.value,
              name: item.name,
              itemStyle: { color: item.color },
            })),
          },
        ],
      };
    });
  }, [
    items,
    charts,
    getChartData,
    textColor,
    bgColor,
    minThreshold,
    tooltipTranslations,
  ]);

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
