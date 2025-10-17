import type {
  PoolDeregistrationsColumns,
  PoolRegistrationsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolDeregistrationsTableStore = handlePersistStore<
  TableOptionsCore<PoolDeregistrationsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolRegistrationsColumns)[]) => void;
  }
>(
  "pool_reg_table_store",
  {
    columnsVisibility: {
      date: true,
      longetivity: true,
      view: true,
      deposit: true,
      pledge: true,
      fee: true,
      hash: true,
      epoch_block: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "longetivity",
      "view",
      "deposit",
      "pledge",
      "fee",
      "hash",
      "epoch_block",
    ],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setIsResponsive: isResponsive =>
      set(state => {
        state.isResponsive = isResponsive;
      }),
    setRows: rows =>
      set(state => {
        state.rows = rows;
      }),
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
