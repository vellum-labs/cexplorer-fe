import type {
  TreasuryContractsColumns,
  TreasuryContractsTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useTreasuryContractsTableStore = () =>
  handlePersistStore<
    TreasuryContractsTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumnsOrder: (columnsOrder: (keyof TreasuryContractsColumns)[]) => void;
    }
  >(
    "treasury_contracts_table_store",
    {
      columnsVisibility: {
        project: true,
        vendor: true,
        budget: true,
        milestones: true,
        status: true,
      },
      isResponsive: true,
      rows: 10,
      columnsOrder: ["project", "vendor", "budget", "milestones", "status"],
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
