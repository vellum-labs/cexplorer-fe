import type { PaginatedSearchParams } from "@/types/tableTypes";

import { GovernanceDetailPage } from "@/pages/governance/GovernanceDetailPage";
import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

export const Route = createFileRoute("/gov/action/$id")({
  component: GovernanceDetailPage,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        order: z.enum(["stake", "represented_by"]).optional().catch("stake"),
        sort: z.enum(["asc", "desc"]).optional().catch("asc"),
      })

      .parse(input),
});
