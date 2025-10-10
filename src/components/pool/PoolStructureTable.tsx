import type { PoolStructureColumns } from "@/types/tableTypes";
import type { FC } from "react";
import { useMemo } from "react";

import Crab from "@/resources/images/icons/crab.svg";
import Dino from "@/resources/images/icons/dino.svg";
import Dolphin from "@/resources/images/icons/dolphin.svg";
import Fish from "@/resources/images/icons/fish.svg";
import Humpback from "@/resources/images/icons/humpback.svg";
import Plankton from "@/resources/images/icons/plankton.svg";
import Shark from "@/resources/images/icons/shark.svg";
import Shrimp from "@/resources/images/icons/shrimp.svg";
import Tuna from "@/resources/images/icons/tuna.svg";
import Whale from "@/resources/images/icons/whale.svg";

import GlobalTable from "../table/GlobalTable";

import ReactEcharts from "echarts-for-react";

import { useFetchPoolDelegatorStats } from "@/services/pools";
import { usePoolDelegatorsStructureStore } from "@/stores/tables/poolDelegatorsStructureStore";

import { getAnimalRangeByName } from "@/utils/address/getAnimalRangeByName";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { Tooltip } from "../ui/tooltip";
import { useGraphColors } from "@/hooks/useGraphColors";

interface PoolStructureTableProps {
  poolId: string;
  sortByAnimalSize?: boolean;
}

interface Items {
  title: string;
  icon: string;
  data: {
    count: number;
    sum: number;
  };
}

export const PoolStructureTable: FC<PoolStructureTableProps> = ({
  poolId,
  sortByAnimalSize = false,
}) => {
  const statsQuery = useFetchPoolDelegatorStats(poolId);
  const { columnsOrder, columnsVisibility, setColumsOrder, rows } =
    usePoolDelegatorsStructureStore();
  const { textColor } = useGraphColors();

  const itemIcons = {
    plankton: Plankton,
    shrimp: Shrimp,
    crab: Crab,
    fish: Fish,
    dolphin: Dolphin,
    shark: Shark,
    whale: Whale,
    humpback: Humpback,
    leviathan: Dino,
    tuna: Tuna,
  };

  const animalOrder = [
    "plankton",
    "shrimp",
    "crab",
    "fish",
    "dolphin",
    "shark",
    "whale",
    "tuna",
    "humpback",
    "leviathan",
  ];

  const items = useMemo(() => {
    const data = statsQuery.data?.data.data[0];
    if (!data) return [];

    const res: Items[] = [];

    for (const key in data) {
      res.push({
        title: key,
        icon: itemIcons[key],
        data: data[key],
      });
    }

    const sorted = res.sort((a, b) => {
      return animalOrder.indexOf(a.title) - animalOrder.indexOf(b.title);
    });

    if (sortByAnimalSize) {
      return sorted.reverse();
    }

    return sorted;
  }, [statsQuery.data, sortByAnimalSize, animalOrder, itemIcons]);

  const columns = [
    {
      key: "wallet_size",
      render: item => {
        return (
          <Tooltip
            content={
              <div className='min-w-[110px]'>
                {getAnimalRangeByName(item.title)}
              </div>
            }
          >
            <div className='flex items-center gap-1'>
              <div className='w-[30px]'>
                <img src={item.icon} />
              </div>
              <span>{item.title[0].toUpperCase() + item.title.slice(1)}</span>
            </div>
          </Tooltip>
        );
      },
      title: <p>Wallet Size</p>,
      visible: columnsVisibility.wallet_size,
      widthPx: 150,
    },
    {
      key: "amount",
      render: item => {
        return <p className='text-right'>{item.data.count}</p>;
      },
      title: <p className='w-full text-right'>Count</p>,
      visible: columnsVisibility.amount,
      widthPx: 100,
    },
    {
      key: "amount_pie",
      render: item => {
        const amountSum = items
          .map(item => item.data.count)
          .reduce((a, b) => a + b, 0);

        const usage = (item.data.count * 100) / amountSum;

        const option = {
          tooltip: {
            trigger: "item",
            confine: true,
            formatter: param => {
              if (param.data.name === "Usage") {
                const animalName =
                  item.title[0].toUpperCase() + item.title.slice(1);
                return `${animalName} count: ${usage.toFixed(2)}%`;
              } else {
                return `Others count: ${(100 - usage).toFixed(2)}%`;
              }
            },
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: usage.toFixed(2),
                  name: "Usage",
                  itemStyle: { color: "#47CD89" },
                },
                {
                  value: (100 - usage).toFixed(2),
                  name: "Left",
                  itemStyle: { color: "#FEC84B" },
                },
              ],
            },
          ],
        };

        return (
          <div className='gap-1/2 flex w-full items-center justify-end'>
            <span>{usage.toFixed(2)}%</span>
            <ReactEcharts option={option} className='max-h-[50px] w-[50px]' />
          </div>
        );
      },
      title: <p className='w-full text-right'>Count %</p>,
      visible: columnsVisibility.amount_pie,
      widthPx: 100,
    },
    {
      key: "holdings",
      render: item => {
        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.data.sum} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Stake</p>,
      visible: columnsVisibility.holdings,
      widthPx: 100,
    },
    {
      key: "holdings_pie",
      render: item => {
        const holdingsSum = items
          .map(item => item.data.sum)
          .reduce((a, b) => a + b, 0);

        const usage = (item.data.sum * 100) / holdingsSum;

        const option = {
          tooltip: {
            trigger: "item",
            confine: true,
            formatter: param => {
              if (param.data.name === "Usage") {
                const animalName =
                  item.title[0].toUpperCase() + item.title.slice(1);
                return `${animalName} stake: ${usage.toFixed(2)}%`;
              } else {
                return `Others stake: ${(100 - usage).toFixed(2)}%`;
              }
            },
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: usage.toFixed(2),
                  name: "Usage",
                  itemStyle: { color: "#47CD89" },
                },
                {
                  value: (100 - usage).toFixed(2),
                  name: "Left",
                  itemStyle: { color: "#FEC84B" },
                },
              ],
            },
          ],
        };

        return (
          <div className='gap-1/2 flex w-full items-center justify-end'>
            <span>{usage.toFixed(2)}%</span>
            <ReactEcharts option={option} className='max-h-[50px] w-[50px]' />
          </div>
        );
      },
      title: <p className='w-full text-right'>Stake %</p>,
      visible: columnsVisibility.holdings_pie,
      widthPx: 100,
    },
  ];

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

  // Chart data for stake
  const stakeChartData = [
    {
      value: items.find(item => item.title === "plankton")?.data?.sum || 0,
      name: "Plankton",
      itemStyle: { color: "#c4f69c" },
    },
    {
      value: items.find(item => item.title === "shrimp")?.data?.sum || 0,
      name: "Shrimp",
      itemStyle: { color: "#f69972" },
    },
    {
      value: items.find(item => item.title === "crab")?.data?.sum || 0,
      name: "Crab",
      itemStyle: { color: "#47CD89" },
    },
    {
      value: items.find(item => item.title === "fish")?.data?.sum || 0,
      name: "Fish",
      itemStyle: { color: "#92c7e4" },
    },
    {
      value: items.find(item => item.title === "dolphin")?.data?.sum || 0,
      name: "Dolphin",
      itemStyle: { color: "#d2d8dc" },
    },
    {
      value: items.find(item => item.title === "shark")?.data?.sum || 0,
      name: "Shark",
      itemStyle: { color: "#3a8dde" },
    },
    {
      value: items.find(item => item.title === "whale")?.data?.sum || 0,
      name: "Whale",
      itemStyle: { color: "#22366c" },
    },
    {
      value: items.find(item => item.title === "tuna")?.data?.sum || 0,
      name: "Tuna",
      itemStyle: { color: "#3a8dde" },
    },
    {
      value: items.find(item => item.title === "humpback")?.data?.sum || 0,
      name: "Humpback",
      itemStyle: { color: "#527381" },
    },
    {
      value: items.find(item => item.title === "leviathan")?.data?.sum || 0,
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
    <div className='flex w-full flex-col gap-4'>
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
      <GlobalTable
        type='default'
        totalItems={items.length}
        itemsPerPage={rows}
        rowHeight={69}
        scrollable
        pagination
        query={statsQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof PoolStructureColumns) -
            columnsOrder.indexOf(b.key as keyof PoolStructureColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
