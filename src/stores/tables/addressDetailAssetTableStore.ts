import type {
  AddressDetailAssetTableOptions,
  AddressDetailAssetColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useAddressDetailAssetTableStore = handlePersistStore<
  AddressDetailAssetTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof AddressDetailAssetColumns)[]) => void;
    setLowBalances: (lowBalances: boolean) => void;
    setActiveAsset: (activeAsset: string) => void;
    setActiveDetail: (activeDetail: string) => void;
  }
>(
  "address_detail_asset_table_store",
  {
    columnsVisibility: {
      token: true,
      policy_id: true,
      ticker: true,
      holdings: true,
      pnl_24: true,
      pnl_7: true,
      portfolio: true,
      price: true,
      supply: true,
      value: true,
      trade: true,
    },
    lowBalances: true,
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "token",
      "policy_id",
      "price",
      "pnl_24",
      "pnl_7",
      "holdings",
      "supply",
      "portfolio",
      "value",
      "trade",
      "ticker",
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
    setLowBalances: lowBalances =>
      set(state => {
        state.lowBalances = !lowBalances;
      }),
    setActiveAsset: activeAsset =>
      set(state => {
        state.activeAsset = activeAsset;
      }),
    setActiveDetail: activeDetail =>
      set(state => {
        state.activeDetail = activeDetail;
      }),
  }),
);
