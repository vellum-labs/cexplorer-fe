import type { PaginatedSearchParams } from "@/types/tableTypes";

import { createFileRoute } from "@tanstack/react-router";

import { EcoImpactPage } from "@/pages/eco-impact/EcoImpactPage";

import { z } from "zod";

export const Route = createFileRoute("/eco-impact/")({
  component: () => <EcoImpactPage />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        mode: z.enum(["delegator", "spo"]).optional().catch(undefined),
        stake: z.string().optional().catch(""),
        pool: z.string().optional().catch(""),
      })
      .parse(input),
});
