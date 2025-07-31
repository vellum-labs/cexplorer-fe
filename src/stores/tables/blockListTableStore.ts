import type { BlockListColumns, TableOptionsCore } from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const useBlockListTableStore = (storeKey?: string) =>
  handlePersistStore<
    TableOptionsCore<BlockListColumns>,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (columnsOrder: (keyof BlockListColumns)[]) => void;
    }
  >(
    storeKey ?? "block_list_table_store",
    {
      columnsVisibility: {
        date: true,
        block_no: true,
        epoch_no: true,
        slot_no: true,
        tx_count: true,
        minted_by: true,
        epoch_slot_no: true,
        vrf_key: false,
        hash: false,
        protocol: false,
        cert_counter: false,
        size: true,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "date",
        "block_no",
        "epoch_no",
        "slot_no",
        "tx_count",
        "minted_by",
        "epoch_slot_no",
        "size",
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
