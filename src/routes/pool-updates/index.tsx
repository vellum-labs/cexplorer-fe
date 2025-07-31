import type { PaginatedSearchParams } from "@/types/tableTypes";

import { PoolUpdatesPage } from "@/pages/pool/PoolUpdatesPage";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/pool-updates/")({
  component: () => <PoolUpdatesPage />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
      })
      .parse(input),
});
