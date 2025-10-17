import type { BasicTableOptions } from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useVotingTableStore = handlePersistStore<
  Pick<BasicTableOptions<void>, "rows">,
  {
    setRows: (rows: number) => void;
  }
>(
  "voting_list_table_store",
  {
    rows: 50,
  },
  set => ({
    setRows: rows =>
      set(state => {
        state.rows = rows;
      }),
  }),
);
