import { createFileRoute } from "@tanstack/react-router";

import { StablecoinDashboardPage } from "@/pages/stablecoin-dashboard/StablecoinDashboardPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { z } from "zod";

export const Route = createFileRoute("/stablecoin-dashboard/")({
  component: StablecoinDashboardPage,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
      })
      .parse(input),
});
