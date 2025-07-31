import PoolListPage from "@/pages/pool/PoolsListPage";
import type { PoolListSearchParams } from "@/types/poolTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/pool/")({
  component: PoolListPage,
  validateSearch: (input: PoolListSearchParams) =>
    z
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
            "average_stake",
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
            "top_delegator",
            "leverage",
          ])
          .optional()
          .catch("ranking"),
        is_drep: z.number().optional().catch(1),
      })
      .parse(input),
});
