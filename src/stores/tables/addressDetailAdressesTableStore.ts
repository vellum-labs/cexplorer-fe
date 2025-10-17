import type {
  AddressDetailAdressesColumns,
  AddressDetailAdressesTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useAddressDetailAdressesTable = handlePersistStore<
  AddressDetailAdressesTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setColumsOrder: (
      columnsOrder: (keyof AddressDetailAdressesColumns)[],
    ) => void;
  }
>(
  "address_detail_addresses_table_store",
  {
    columnsVisibility: {
      address: true,
      balance: true,
      activity: true,
      last_activity: true,
      tokens: true,
    },
    columnsOrder: ["address", "balance", "activity", "last_activity", "tokens"],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
