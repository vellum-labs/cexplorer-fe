import type { FC } from "react";

import { useFetchPoolDelegatorStats } from "@/services/pools";
import { usePoolDelegatorsStructureStore } from "@/stores/tables/poolDelegatorsStructureStore";
import type { PoolStructureColumns } from "@/types/tableTypes";

import { DelegatorStructureView } from "../global/DelegatorStructureView";
import { poolStructureTableOptions } from "@/constants/tables/poolStructureTableOptions";

interface PoolStructureTableProps {
  poolId: string;
  sortByAnimalSize?: boolean;
  setSortByAnimalSize?: (value: boolean) => void;
  rows?: number;
  setRows?: (rows: number) => void;
  columnsVisibility?: PoolStructureColumns;
  setColumnVisibility?: (
    key: keyof PoolStructureColumns,
    value: boolean,
  ) => void;
}

export const PoolStructureTable: FC<PoolStructureTableProps> = ({
  poolId,
  sortByAnimalSize = false,
  setSortByAnimalSize,
  rows: rowsProp,
  setRows: setRowsProp,
  columnsVisibility: columnsVisibilityProp,
  setColumnVisibility: setColumnVisibilityProp,
}) => {
  const statsQuery = useFetchPoolDelegatorStats(poolId);
  const store = usePoolDelegatorsStructureStore();

  const columnsOrder = store.columnsOrder;
  const setColumsOrder = store.setColumsOrder;
  const rows = rowsProp ?? store.rows;
  const setRows = setRowsProp ?? store.setRows;
  const columnsVisibility = columnsVisibilityProp ?? store.columnsVisibility;
  const setColumnVisibility =
    setColumnVisibilityProp ?? store.setColumnVisibility;

  return (
    <DelegatorStructureView
      dataQuery={statsQuery}
      columnsOrder={columnsOrder}
      columnsVisibility={columnsVisibility}
      setColumsOrder={setColumsOrder}
      rows={rows}
      setRows={setRows}
      setColumnVisibility={setColumnVisibility}
      sortByAnimalSize={sortByAnimalSize}
      setSortByAnimalSize={setSortByAnimalSize}
      columnType='pool'
      tableOptions={poolStructureTableOptions}
    />
  );
};
