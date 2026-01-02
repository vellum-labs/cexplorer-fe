import type { FC } from "react";
import ReactEcharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { getAnimalColorByName } from "@/utils/address/getAnimalColorByName";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import type { DelegatorStructureItem } from "./DelegatorStructureView";
import { useADADisplay } from "@/hooks/useADADisplay";

interface DelegatorStructureChartsProps {
  items: DelegatorStructureItem[];
}

type StakeTooltipParams = CallbackDataParams & {
  marker?: string;
  name: string;
  value: number;
};

export const DelegatorStructureCharts: FC<DelegatorStructureChartsProps> = ({
  items,
}) => {
  const { textColor } = useGraphColors();
  const { formatLovelace } = useADADisplay();

  const countChartData = items
    .filter(item => item.data.count > 0)
    .map(item => ({
      value: item.data.count,
      name: item.title.charAt(0).toUpperCase() + item.title.slice(1),
      itemStyle: { color: getAnimalColorByName(item.title) },
    }));

  const stakeChartData = items
    .filter(item => item.data.sum > 0)
    .map(item => ({
      value: item.data.sum,
      name: item.title.charAt(0).toUpperCase() + item.title.slice(1),
      itemStyle: { color: getAnimalColorByName(item.title) },
    }));

  const countChartOption = {
    tooltip: {
      trigger: "item",
      confine: true,
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          color: textColor,
          position: "outside",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: textColor,
          },
        },
        labelLine: {
          show: true,
          length: 30,
          lineStyle: {
            width: 2,
          },
        },
        data: countChartData,
      },
    ],
  };

  const stakeChartOption = {
    tooltip: {
      trigger: "item",
      confine: true,
      formatter: (params: StakeTooltipParams) => {
        const marker = params.marker ? `${params.marker} ` : "";
        return `${marker}${params.name} ${formatLovelace(params.value)}`;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          color: textColor,
          position: "outside",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: textColor,
          },
        },
        labelLine: {
          show: true,
          length: 30,
          lineStyle: {
            width: 2,
          },
        },
        data: stakeChartData,
      },
    ],
  };

  return (
    <div className='flex w-full flex-wrap gap-4 xl:flex-nowrap'>
      <div className='w-full xl:w-1/2'>
        <h3 className='mb-2 text-center'>Delegators structure by count</h3>
        <ReactEcharts
          className='h-full w-full md:min-h-[500px]'
          option={countChartOption}
        />
      </div>
      <div className='w-full xl:w-1/2'>
        <h3 className='mb-2 text-center'>Delegators structure by stake</h3>
        <ReactEcharts
          className='h-full w-full md:min-h-[500px]'
          option={stakeChartOption}
        />
      </div>
    </div>
  );
};
