import type {
  StakeRegistrationsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useStakeRegistrationsTableStore = handlePersistStore<
  TableOptionsCore<StakeRegistrationsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof StakeRegistrationsColumns)[]) => void;
  }
>(
  "stake_reg_table_store",
  {
    columnsVisibility: {
      date: true,
      type: true,
      view: true,
      deposit: true,
      hash: true,
      epoch_block: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["date", "type", "view", "deposit", "hash", "epoch_block"],
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
