import type { FC } from "react";
import ReactEcharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";

interface Items {
  title: string;
  icon: string;
  data: {
    count: number;
    sum: number;
  };
}

interface DelegatorStructureChartsProps {
  items: Items[];
}

export const DelegatorStructureCharts: FC<DelegatorStructureChartsProps> = ({
  items,
}) => {
  const { textColor } = useGraphColors();

  // Chart data for count
  const countChartData = [
    {
      value: items.find(item => item.title === "plankton")?.data?.count || 0,
      name: "Plankton",
      itemStyle: { color: "#c4f69c" },
    },
    {
      value: items.find(item => item.title === "shrimp")?.data?.count || 0,
      name: "Shrimp",
      itemStyle: { color: "#f69972" },
    },
    {
      value: items.find(item => item.title === "crab")?.data?.count || 0,
      name: "Crab",
      itemStyle: { color: "#47CD89" },
    },
    {
      value: items.find(item => item.title === "fish")?.data?.count || 0,
      name: "Fish",
      itemStyle: { color: "#92c7e4" },
    },
    {
      value: items.find(item => item.title === "dolphin")?.data?.count || 0,
      name: "Dolphin",
      itemStyle: { color: "#d2d8dc" },
    },
    {
      value: items.find(item => item.title === "shark")?.data?.count || 0,
      name: "Shark",
      itemStyle: { color: "#3a8dde" },
    },
    {
      value: items.find(item => item.title === "whale")?.data?.count || 0,
      name: "Whale",
      itemStyle: { color: "#22366c" },
    },
    {
      value: items.find(item => item.title === "tuna")?.data?.count || 0,
      name: "Tuna",
      itemStyle: { color: "#3a8dde" },
    },
    {
      value: items.find(item => item.title === "humpback")?.data?.count || 0,
      name: "Humpback",
      itemStyle: { color: "#527381" },
    },
    {
      value: items.find(item => item.title === "leviathan")?.data?.count || 0,
      name: "Leviathan",
      itemStyle: { color: "#81ba71" },
    },
  ];

  // Chart data for stake (convert lovelace to ADA and round to 0 digits)
  const stakeChartData = [
    {
      value: Math.round((items.find(item => item.title === "plankton")?.data?.sum || 0) / 1000000),
      name: "Plankton",
      itemStyle: { color: "#c4f69c" },
    },
    {
      value: Math.round((items.find(item => item.title === "shrimp")?.data?.sum || 0) / 1000000),
      name: "Shrimp",
      itemStyle: { color: "#f69972" },
    },
    {
      value: Math.round((items.find(item => item.title === "crab")?.data?.sum || 0) / 1000000),
      name: "Crab",
      itemStyle: { color: "#47CD89" },
    },
    {
      value: Math.round((items.find(item => item.title === "fish")?.data?.sum || 0) / 1000000),
      name: "Fish",
      itemStyle: { color: "#92c7e4" },
    },
    {
      value: Math.round((items.find(item => item.title === "dolphin")?.data?.sum || 0) / 1000000),
      name: "Dolphin",
      itemStyle: { color: "#d2d8dc" },
    },
    {
      value: Math.round((items.find(item => item.title === "shark")?.data?.sum || 0) / 1000000),
      name: "Shark",
      itemStyle: { color: "#3a8dde" },
    },
    {
      value: Math.round((items.find(item => item.title === "whale")?.data?.sum || 0) / 1000000),
      name: "Whale",
      itemStyle: { color: "#22366c" },
    },
    {
      value: Math.round((items.find(item => item.title === "tuna")?.data?.sum || 0) / 1000000),
      name: "Tuna",
      itemStyle: { color: "#3a8dde" },
    },
    {
      value: Math.round((items.find(item => item.title === "humpback")?.data?.sum || 0) / 1000000),
      name: "Humpback",
      itemStyle: { color: "#527381" },
    },
    {
      value: Math.round((items.find(item => item.title === "leviathan")?.data?.sum || 0) / 1000000),
      name: "Leviathan",
      itemStyle: { color: "#81ba71" },
    },
  ];

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
