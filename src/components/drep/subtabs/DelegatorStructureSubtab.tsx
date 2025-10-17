import type { FC } from "react";

import { useFetchDrepDelegatorStats } from "@/services/drep";

import { useDrepDelegatorsStructureStore } from "@/stores/tables/drepDelegatorStructureTableStore";
import { DelegatorStructureView } from "@/components/global/DelegatorStructureView";
import { drepStructureTableOptions } from "@/constants/tables/drepStructureTableOptions";
import type { DrepStructureColumns } from "@/types/tableTypes";

interface DelegatorStructureSubtabProps {
  view: string;
  sortByAnimalSize?: boolean;
  setSortByAnimalSize?: (value: boolean) => void;
  rows?: number;
  setRows?: (rows: number) => void;
  columnsVisibility?: DrepStructureColumns;
  setColumnVisibility?: (
    key: keyof DrepStructureColumns,
    value: boolean,
  ) => void;
}

export const DelegatorStructureSubtab: FC<DelegatorStructureSubtabProps> = ({
  view,
  sortByAnimalSize = false,
  setSortByAnimalSize,
  rows: rowsProp,
  setRows: setRowsProp,
  columnsVisibility: columnsVisibilityProp,
  setColumnVisibility: setColumnVisibilityProp,
}) => {
  const structureQuery = useFetchDrepDelegatorStats(view);
  const store = useDrepDelegatorsStructureStore();

  const columnsOrder = store.columnsOrder;
  const setColumsOrder = store.setColumsOrder;
  const rows = rowsProp ?? store.rows;
  const setRows = setRowsProp ?? store.setRows;
  const columnsVisibility = columnsVisibilityProp ?? store.columnsVisibility;
  const setColumnVisibility =
    setColumnVisibilityProp ?? store.setColumnVisibility;

  return (
    <DelegatorStructureView
      dataQuery={structureQuery}
      columnsOrder={columnsOrder}
      columnsVisibility={columnsVisibility}
      setColumsOrder={setColumsOrder}
      rows={rows}
      setRows={setRows}
      setColumnVisibility={setColumnVisibility}
      sortByAnimalSize={sortByAnimalSize}
      setSortByAnimalSize={setSortByAnimalSize}
      columnType='drep'
      tableOptions={drepStructureTableOptions}
    />
  );
};
