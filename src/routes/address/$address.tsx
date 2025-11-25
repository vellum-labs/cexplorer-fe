import { createFileRoute } from "@tanstack/react-router";

import { AddressDetailPage } from "@/pages/address/AddressDetailPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { z } from "zod";

export const Route = createFileRoute("/address/$address")({
  component: () => <AddressDetailPage />,
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
        asset: z.enum(["all", "tokens", "nfts"]).optional().catch("all"),
      })
      .parse(input),
});
