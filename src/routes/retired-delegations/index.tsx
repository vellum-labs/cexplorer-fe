import { RetiredDelegationsPage } from "@/pages/delegations/RetiredDelegationsPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/retired-delegations/")({
  component: () => <RetiredDelegationsPage />,
  validateSearch: (
    input: PaginatedSearchParams & {
      type: "live" | "active";
      order: "date" | "live_stake";
    },
  ) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        type: z.string().optional().catch("live"),
        order: z.string().optional().catch("date"),
        tab: z.enum(["live", "active"]).optional().catch("live"),
      })
      .parse(input),
});
