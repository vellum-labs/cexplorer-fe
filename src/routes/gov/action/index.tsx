import type { PoolListSearchParams } from "@/types/poolTypes";

import { GovernancePage } from "@/pages/governance/GovernancePage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/gov/action/")({
  component: GovernancePage,
  validateSearch: (input: PoolListSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        state: z
          .enum(["All", "Active", "Ratified", "Enacted", "Expired"])
          .optional()
          .catch("All"),
      })
      .parse(input),
});
