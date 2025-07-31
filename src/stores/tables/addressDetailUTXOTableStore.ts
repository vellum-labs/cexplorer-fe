import type {
  AddressDetailUTXOColumns,
  AddressDetailUTXOOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@/lib/handlePersistStore";

export const useAddressDetailUTXOTableStore = handlePersistStore<
  AddressDetailUTXOOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof AddressDetailUTXOColumns)[]) => void;
  }
>(
  "address_detail_utxo_table_store",
  {
    isResponsive: true,
    rows: 20,
    columnsVisibility: {
      amount: true,
      hash: true,
      index: true,
      min_utxo: true,
    },
    columnsOrder: ["hash", "index", "amount", "min_utxo"],
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
