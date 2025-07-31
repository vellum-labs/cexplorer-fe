import type { PaginatedSearchParams } from "@/types/tableTypes";

import { DrepDetailPage } from "@/pages/drep/DrepDetailPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/drep/$hash")({
  component: () => <DrepDetailPage />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        tab: z.string().optional().catch("governance_actions"),
      })
      .parse(input),
});
