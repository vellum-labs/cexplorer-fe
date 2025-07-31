import { StakeDetailPage } from "@/pages/stake/StakeDetailPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/stake/$stakeAddr")({
  component: () => <StakeDetailPage />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        order: z.enum(["balance", "last"]).optional().catch("balance"),
        asset: z.enum(["all", "tokens", "nft"]).optional().catch("all"),
      })
      .parse(input),
});
