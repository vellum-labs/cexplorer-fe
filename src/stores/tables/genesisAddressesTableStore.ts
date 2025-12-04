import type {
  GenesisAddressesTableColumns,
  GenesisAddressesTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useGenesisAddressesTableStore = () =>
  handlePersistStore<
    GenesisAddressesTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (
        columnsOrder: (keyof GenesisAddressesTableColumns)[],
      ) => void;
    }
  >(
    "genesis_addresses_table_store",
    {
      columnsVisibility: {
        order: true,
        address: true,
        value: true,
        balance: true,
        first_activity: true,
        last_activity: true,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "order",
        "address",
        "value",
        "balance",
        "first_activity",
        "last_activity",
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
