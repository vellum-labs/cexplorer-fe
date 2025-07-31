import type { PaginatedSearchParams } from "@/types/tableTypes";

import { createFileRoute } from "@tanstack/react-router";

import { TokenDashboardPage } from "@/pages/token/TokenDashboardPage";
import { z } from "zod";

export const Route = createFileRoute("/token/dashboard/")({
  component: TokenDashboardPage,
  validateSearch: (input: PaginatedSearchParams) =>
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
          .enum(["volume", "price", "liquidity"])
          .optional()
          .catch("volume"),
      })
      .parse(input),
});
