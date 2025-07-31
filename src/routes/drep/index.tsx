import type { PaginatedSearchParams } from "@/types/tableTypes";

import { DrepListPage } from "@/pages/drep/DrepListPage";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/drep/")({
  component: () => <DrepListPage />,
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
          .enum([
            "average_power",
            "power",
            "own",
            "since",
            "delegator",
            "average_stake",
            "top_delegator",
          ])
          .optional()
          .catch("average_power"),
      })
      .parse(input),
});
