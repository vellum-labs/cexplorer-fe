import type { PaginatedSearchParams } from "@/types/tableTypes";

import { createFileRoute } from "@tanstack/react-router";

import { AccountAnalytics } from "@/pages/analytics/AccountAnalytics";
import { z } from "zod";

export const Route = createFileRoute("/analytics/account")({
  component: () => <AccountAnalytics />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        addresses_drep_only: z
          .union([z.literal(2), z.literal(1)])
          .optional()
          .catch(1),
        addresses_pool_only: z
          .union([z.literal(2), z.literal(1)])
          .optional()
          .catch(1),
      })
      .parse(input),
});
