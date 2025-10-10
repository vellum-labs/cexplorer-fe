import type { FC } from "react";
import { useMemo } from "react";

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
import { ArrowRight } from "lucide-react";

import { DelegatorStructureCharts } from "./DelegatorStructureCharts";
import { DelegatorStructureTable } from "./DelegatorStructureTable";
import TableSettingsDropdown from "./dropdowns/TableSettingsDropdown";

interface Items {
  title: string;
  icon: string;
  data: {
    count: number;
    sum: number;
  };
}

interface DelegatorStructureViewProps {
  dataQuery: any;
  columnsOrder: any;
  columnsVisibility: any;
  setColumsOrder: any;
  rows: number;
  setRows: (rows: number) => void;
  setColumnVisibility: (key: string, value: boolean) => void;
  sortByAnimalSize: boolean;
  setSortByAnimalSize?: (value: boolean) => void;
  columnType: "pool" | "drep";
  tableOptions: Array<{
    key: string;
    name: string;
  }>;
}

const itemIcons: Record<string, string> = {
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

export const DelegatorStructureView: FC<DelegatorStructureViewProps> = ({
  dataQuery,
  columnsOrder,
  columnsVisibility,
  setColumsOrder,
  rows,
  setRows,
  setColumnVisibility,
  sortByAnimalSize,
  setSortByAnimalSize,
  columnType,
  tableOptions,
}) => {
  const items = useMemo(() => {
    const data = dataQuery.data?.data.data[0];
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
  }, [dataQuery.data, sortByAnimalSize]);

  return (
    <div className='flex w-full flex-col gap-2'>
      <DelegatorStructureCharts items={items} />
      {setSortByAnimalSize && (
        <div className='flex w-full justify-end'>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setSortByAnimalSize(!sortByAnimalSize)}
              className={`flex h-10 items-center gap-1 rounded-s border border-border px-2 transition-colors ${sortByAnimalSize ? "bg-primary/10" : "bg-transparent hover:bg-darker"}`}
              title='Sort by animal size'
            >
              {sortByAnimalSize ? (
                <>
                  <img src={Plankton} className='h-5 w-5' alt='Plankton' />
                  <ArrowRight size={16} />
                  <img src={Dino} className='h-5 w-5' alt='Leviathan' />
                </>
              ) : (
                <>
                  <img src={Dino} className='h-5 w-5' alt='Leviathan' />
                  <ArrowRight size={16} />
                  <img src={Plankton} className='h-5 w-5' alt='Plankton' />
                </>
              )}
            </button>
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={tableOptions.map(item => {
                return {
                  label: item.name,
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
      )}
      <DelegatorStructureTable
        items={items}
        columnsOrder={columnsOrder}
        columnsVisibility={columnsVisibility}
        setColumsOrder={setColumsOrder}
        rows={rows}
        query={dataQuery}
        columnType={columnType}
      />
    </div>
  );
};
