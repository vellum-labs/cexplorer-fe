import type {
  BasicTableOptions,
  PoolDelegatorsColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolDelegatorsTableStore = handlePersistStore<
  BasicTableOptions<PoolDelegatorsColumns> & { activeTab: string },
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolDelegatorsColumns)[]) => void;
    setActiveTab: (activeTab: string) => void;
  }
>(
  "pool_delegators_table_store",
  {
    columnsVisibility: {
      date: true,
      active_in: true,
      address: true,
      amount: true,
      loyalty: true,
      tx: true,
      registered: true,
      pool_delegation: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "active_in",
      "address",
      "pool_delegation",
      "amount",
      "loyalty",
      "registered",
      "tx",
    ],
    activeTab: "stake-pools",
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
    setActiveTab: activeTab =>
      set(state => {
        state.activeTab = activeTab;
      }),
  }),
);
