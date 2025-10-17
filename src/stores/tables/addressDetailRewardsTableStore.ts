import type {
  AddressDetailRewardsTableColumns,
  AddressDetailRewardsTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useAddressDetailRewardsTableStore = handlePersistStore<
  AddressDetailRewardsTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof AddressDetailRewardsTableColumns)[],
    ) => void;
  }
>(
  "address_detail_rewards_table_store",
  {
    columnsVisibility: {
      epoch: true,
      date: true,
      stake_pool: true,
      active_stake: true,
      reward: true,
      roa: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "epoch",
      "date",
      "stake_pool",
      "active_stake",
      "reward",
      "roa",
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
