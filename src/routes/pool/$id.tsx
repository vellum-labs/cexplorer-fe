import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import PoolDetailPage from "../../pages/pool/PoolDetailPage";

export const Route = createFileRoute("/pool/$id")({
  component: PoolDetailPage,
  validateSearch: (
    input: PaginatedSearchParams & {
      order: "live_stake" | "slot_update" | undefined;
      sort: "asc" | "desc" | undefined;
    },
  ) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        order: z
          .enum(["live_stake", "slot_update"])
          .optional()
          .catch("live_stake"),
        sort: z.enum(["asc", "desc"]).optional().catch("asc"),
        tab: z.string().optional().catch("overview"),
      })
      .parse(input),
});
