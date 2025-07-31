import type { BasicTableOptions } from "@/types/tableTypes";

import { handlePersistStore } from "@/lib/handlePersistStore";

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
