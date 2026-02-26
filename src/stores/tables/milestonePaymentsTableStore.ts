import type {
  MilestonePaymentsColumns,
  MilestonePaymentsTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useMilestonePaymentsTableStore = () =>
  handlePersistStore<
    MilestonePaymentsTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumnsOrder: (columnsOrder: (keyof MilestonePaymentsColumns)[]) => void;
    }
  >(
    "milestone_payments_table_store",
    {
      columnsVisibility: {
        milestone: true,
        event: true,
        amount: true,
        transaction: true,
        date: true,
      },
      isResponsive: true,
      rows: 10,
      columnsOrder: ["milestone", "event", "amount", "transaction", "date"],
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
      setColumnsOrder: columnsOrder =>
        set(state => {
          state.columnsOrder = columnsOrder;
        }),
    }),
  );
