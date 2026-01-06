import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export type HandlesListColumns =
  | "minted"
  | "standard"
  | "handle"
  | "policy"
  | "quantity"
  | "transaction";

export interface HandlesListTableOptions {
  columnsVisibility: Record<HandlesListColumns, boolean>;
  rows: number;
}

export const useHandlesListTableStore = () =>
  handlePersistStore<
    HandlesListTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setRows: (rows: number) => void;
    }
  >(
    "handles_list_table_store",
    {
      columnsVisibility: {
        minted: true,
        standard: true,
        handle: true,
        policy: true,
        quantity: true,
        transaction: true,
      },
      rows: 20,
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
    }),
  );
