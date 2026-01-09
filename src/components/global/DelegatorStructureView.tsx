import type { FC } from "react";
import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { addressIcons } from "@/constants/address";
import { ANIMAL_ORDER, AnimalName, isAnimalName } from "@/constants/animals";

import type { PoolDelegatorStatsResponse } from "@/types/poolTypes";
import type { PoolStructureColumns } from "@/types/tableTypes";

import { DelegatorStructureCharts } from "./DelegatorStructureCharts";
import { DelegatorStructureTable } from "./DelegatorStructureTable";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export interface DelegatorStructureItem {
  title: AnimalName;
  icon: string;
  data: {
    count: number;
    sum: number;
  };
}

export type DelegatorStructureColumnKey = keyof PoolStructureColumns;
export type DelegatorStructureColumnsState = Record<
  DelegatorStructureColumnKey,
  boolean
>;

interface DelegatorStructureViewProps {
  dataQuery: UseQueryResult<PoolDelegatorStatsResponse, unknown>;
  columnsOrder: DelegatorStructureColumnKey[];
  columnsVisibility: DelegatorStructureColumnsState;
  setColumsOrder: (order: DelegatorStructureColumnKey[]) => void;
  rows: number;
  setRows: (rows: number) => void;
  setColumnVisibility: (
    key: DelegatorStructureColumnKey,
    value: boolean,
  ) => void;
  sortByAnimalSize: boolean;
  setSortByAnimalSize?: (value: boolean) => void;
  columnType: "pool" | "drep";
  tableOptions: Array<{
    key: DelegatorStructureColumnKey;
    name: string;
  }>;
}

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
  const { t } = useAppTranslation();
  const animals = useMemo<DelegatorStructureItem[]>(() => {
    const data = dataQuery.data?.data.data?.[0] as
      | PoolDelegatorStatsResponse["data"]["data"][number]
      | undefined;
    if (!data) return [];

    const validAnimals = Object.keys(data).filter(isAnimalName) as AnimalName[];

    const animalStructured = validAnimals.map(animalName => ({
      title: animalName,
      icon: addressIcons[animalName],
      data: data[animalName],
    }));

    const sorted = [...animalStructured].sort((a, b) => {
      return ANIMAL_ORDER.indexOf(a.title) - ANIMAL_ORDER.indexOf(b.title);
    });

    if (sortByAnimalSize) {
      return sorted.reverse();
    }

    return sorted;
  }, [dataQuery.data, sortByAnimalSize]);

  return (
    <div className='flex w-full flex-col gap-2'>
      <DelegatorStructureCharts items={animals} type={columnType} />
      {setSortByAnimalSize && (
        <div className='flex w-full justify-end'>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setSortByAnimalSize(!sortByAnimalSize)}
              className={`flex h-10 items-center gap-1 rounded-s border border-border px-2 transition-colors ${sortByAnimalSize ? "bg-primary/10" : "bg-transparent hover:bg-darker"}`}
              title={t("global.delegatorStructure.sortByAnimalSize")}
            >
              {sortByAnimalSize ? (
                <>
                  <img
                    src={addressIcons[AnimalName.Plankton]}
                    className='h-5 w-5'
                    alt='Plankton'
                  />
                  <ArrowRight size={16} />
                  <img
                    src={addressIcons[AnimalName.Leviathan]}
                    className='h-5 w-5'
                    alt='Leviathan'
                  />
                </>
              ) : (
                <>
                  <img
                    src={addressIcons[AnimalName.Leviathan]}
                    className='h-5 w-5'
                    alt='Leviathan'
                  />
                  <ArrowRight size={16} />
                  <img
                    src={addressIcons[AnimalName.Plankton]}
                    className='h-5 w-5'
                    alt='Plankton'
                  />
                </>
              )}
            </button>
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={tableOptions.map(item => {
                return {
                  label: t(`common:tableSettings.${item.key}`),
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
        items={animals}
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
