import type {
  PolicyDetailOwnerTableColumns,
  PolicyDetailOwnerTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePolicyDetailOwnerTableStore = handlePersistStore<
  PolicyDetailOwnerTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof PolicyDetailOwnerTableColumns)[],
    ) => void;
  }
>(
  "policy_detail_owner_table_store",
  {
    columnsVisibility: {
      order: true,
      address: true,
      quantity: true,
      share: true,
    },
    rows: 20,
    columnsOrder: ["order", "address", "quantity", "share"],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
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
