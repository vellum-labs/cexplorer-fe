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
  }, [statsQuery.data, sortByAnimalSize]);

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

  return (
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
  );
};
