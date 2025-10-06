import type { DrepStructureColumns } from "@/types/tableTypes";
import type { FC } from "react";

import Plankton from "@/resources/images/icons/plankton.svg";
import Shrimp from "@/resources/images/icons/shrimp.svg";
import Crab from "@/resources/images/icons/crab.svg";
import Fish from "@/resources/images/icons/fish.svg";
import Dolphin from "@/resources/images/icons/dolphin.svg";
import Shark from "@/resources/images/icons/shark.svg";
import Whale from "@/resources/images/icons/whale.svg";
import Humpback from "@/resources/images/icons/humpback.svg";
import Dino from "@/resources/images/icons/dino.svg";
import Tuna from "@/resources/images/icons/tuna.svg";

import GlobalTable from "@/components/table/GlobalTable";
import EChartsReact from "echarts-for-react";
import Tabs from "@/components/global/Tabs";

import { useState } from "react";
import { useFetchDrepDelegatorStats } from "@/services/drep";

import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { useDrepDelegatorsStructureStore } from "@/stores/tables/drepDelegatorStructureTableStore";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { useGraphColors } from "@/hooks/useGraphColors";

interface Items {
  title: string;
  icon: string;
  data: {
    count: number;
    sum: number;
  };
}

interface DelegatorStructureSubtabProps {
  view: string;
}

export const DelegatorStructureSubtab: FC<DelegatorStructureSubtabProps> = ({
  view,
}) => {
  const [active, setActive] = useState<string>("count");

  const structureQuery = useFetchDrepDelegatorStats(view);
  const { columnsOrder, columnsVisibility, setColumsOrder, rows } =
    useDrepDelegatorsStructureStore();
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

  const items = (() => {
    const data = structureQuery.data?.data.data[0];
    const res: Items[] = [];

    for (const key in data) {
      res.push({
        title: key,
        icon: itemIcons[key],
        data: data[key],
      });
    }

    return res;
  })();

  const columns = [
    {
      key: "wallet_size",
      render: item => {
        return (
          <div className='flex items-center gap-1'>
            <div className='w-[30px]'>
              <img src={item.icon} />
            </div>
            <span>{item.title[0].toUpperCase() + item.title.slice(1)}</span>
          </div>
        );
      },
      title: <p>Wallet Size</p>,
      visible: columnsVisibility.wallet_size,
      widthPx: 50,
    },
    {
      key: "amount",
      render: item => {
        return <p className='text-right'>{item.data.count}</p>;
      },
      title: <p className='w-full text-right'>Count</p>,
      visible: columnsVisibility.amount,
      widthPx: 50,
    },

    {
      key: "holdings",
      render: item => {
        return (
          <p className='text-right'>
            {item.data.sum > 0 ? (
              <AdaWithTooltip data={item.data.sum} />
            ) : (
              lovelaceToAda(item.data.sum)
            )}
          </p>
        );
      },
      title: <p className='w-full text-right'>Stake</p>,
      visible: columnsVisibility.holdings,
      widthPx: 50,
    },
  ];

  const crabUsage =
    active === "count"
      ? items.find(item => item.title === "crab")?.data?.count
      : items.find(item => item.title === "crab")?.data?.sum;

  const fishUsage =
    active === "count"
      ? items.find(item => item.title === "fish")?.data?.count
      : items.find(item => item.title === "fish")?.data?.sum;

  const tunaUsage =
    active === "count"
      ? items.find(item => item.title === "tuna")?.data?.count
      : items.find(item => item.title === "tuna")?.data?.sum;

  const sharkUsage =
    active === "count"
      ? items.find(item => item.title === "shark")?.data?.count
      : items.find(item => item.title === "shark")?.data?.sum;

  const whaleUsage =
    active === "count"
      ? items.find(item => item.title === "whale")?.data?.count
      : items.find(item => item.title === "whale")?.data?.sum;

  const shrimpUsage =
    active === "count"
      ? items.find(item => item.title === "shrimp")?.data?.count
      : items.find(item => item.title === "shrimp")?.data?.sum;

  const dolphinUsage =
    active === "count"
      ? items.find(item => item.title === "dolphin")?.data?.count
      : items.find(item => item.title === "dolphin")?.data?.sum;

  const humpbackUsage =
    active === "count"
      ? items.find(item => item.title === "humpback")?.data?.count
      : items.find(item => item.title === "humpback")?.data?.sum;

  const planktonUsage =
    active === "count"
      ? items.find(item => item.title === "plankton")?.data?.count
      : items.find(item => item.title === "plankton")?.data?.sum;

  const leviathanUsage =
    active === "count"
      ? items.find(item => item.title === "leviathan")?.data?.count
      : items.find(item => item.title === "leviathan")?.data?.sum;

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
    },
    grid: {},
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
        tooltip: {
          trigger: "item",
          confine: true,
        },
        data: [
          {
            value: crabUsage,
            name: "Crab",
            itemStyle: { color: "#47CD89" },
          },
          {
            value: fishUsage,
            name: "Fish",
            itemStyle: { color: "#92c7e4" },
          },
          {
            value: tunaUsage,
            name: "Tuna",
            itemStyle: { color: "#3a8dde" },
          },
          {
            value: sharkUsage,
            name: "Shark",
            itemStyle: { color: "#3a8dde" },
          },
          {
            value: whaleUsage,
            name: "Whale",
            itemStyle: { color: "#22366c" },
          },
          {
            value: shrimpUsage,
            name: "Shrimp",
            itemStyle: { color: "#f69972" },
          },
          {
            value: dolphinUsage,
            name: "Dolphin",
            itemStyle: { color: "#d2d8dc" },
          },
          {
            value: humpbackUsage,
            name: "Humpback",
            itemStyle: { color: "#527381" },
          },
          {
            value: planktonUsage,
            name: "Plankton",
            itemStyle: { color: "#c4f69c" },
          },
          {
            value: leviathanUsage,
            name: "Leviathan",
            itemStyle: { color: "#81ba71" },
          },
        ],
      },
    ],
  };

  const tabs = [
    {
      key: "count",
      label: "Count",
      visible: true,
    },
    {
      key: "stake",
      label: "Stake",
      visible: true,
    },
  ];

  return (
    <div className='flex w-full flex-wrap gap-1.5 xl:flex-nowrap'>
      <GlobalTable
        type='default'
        totalItems={items.length}
        itemsPerPage={rows}
        rowHeight={80}
        pagination
        query={structureQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof DrepStructureColumns) -
            columnsOrder.indexOf(b.key as keyof DrepStructureColumns)
          );
        })}
        minContentWidth={150}
        onOrderChange={setColumsOrder}
      />
      <div className='h-full w-full items-center justify-center'>
        <Tabs
          items={tabs}
          withMargin={true}
          withPadding={false}
          onClick={activeTab => setActive(activeTab)}
        />

        <EChartsReact
          className='h-full w-full md:min-h-[700px]'
          option={option}
        />
      </div>
    </div>
  );
};
