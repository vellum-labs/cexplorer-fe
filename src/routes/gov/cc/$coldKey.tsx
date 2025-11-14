import type { PaginatedSearchParams } from "@/types/tableTypes";
import { CCMemberDetailPage } from "@/pages/governance/CCMemberDetailPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/gov/cc/$coldKey")({
  component: () => <CCMemberDetailPage />,
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
