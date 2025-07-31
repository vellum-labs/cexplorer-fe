import type {
  ScriptDetailUsesColumns,
  ScriptDetailUsesTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const useScriptDetailUsesTableStore = handlePersistStore<
  ScriptDetailUsesTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof ScriptDetailUsesColumns)[]) => void;
  }
>(
  "script_detail_uses_table_store",
  {
    columnsVisibility: {
      date: true,
      hash: true,
      output: true,
      fee: true,
      memory: true,
      steps: true,
      purpose: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "hash",
      "output",
      "fee",
      "memory",
      "steps",
      "purpose",
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
