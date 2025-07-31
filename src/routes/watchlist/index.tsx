import { WatchlistPage } from "@/pages/watchlist/WatchlistPage";
import type { PoolListSearchParams } from "@/types/poolTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/watchlist/")({
  component: () => <WatchlistPage />,
  validateSearch: (input: PoolListSearchParams) => {
    return z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        sort: z.enum(["asc", "desc"]).optional().catch("desc"),
        order: z
          .enum([
            "ranking",
            "live_stake",
            "active_stake",
            "delegators",
            "pledge",
            "blocks",
            "pledged",
            "roa_lifetime",
            "roa_recent",
            "blocks_epoch",
            "blocks_total",
            "slot_update",
          ])
          .optional()
          .catch("live_stake"),
      })
      .parse(input);
  },
});
