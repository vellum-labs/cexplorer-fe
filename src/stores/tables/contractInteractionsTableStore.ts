import type {
  ContractInteractionsColumns,
  TableOptionsCore,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useContractInteractionsTableStore = handlePersistStore<
  TableOptionsCore<ContractInteractionsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof ContractInteractionsColumns)[],
    ) => void;
  }
>(
  "contract_interactions_table_store",
  {
    columnsVisibility: {
      date: true,
      type: true,
      purpose: true,
      view: true,
      deposit: true,
      unit_steps: true,
      hash: true,
      epoch_block: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "type",
      "purpose",
      "view",
      "deposit",
      "unit_steps",
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
