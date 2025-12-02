import type { PaginatedSearchParams } from "@/types/tableTypes";

import { createFileRoute } from "@tanstack/react-router";

import { GenesisAddressesPage } from "@/pages/analytics/GenesisAddressesPage";
import { z } from "zod";

export const Route = createFileRoute("/analytics/genesis")({
  component: () => <GenesisAddressesPage />,
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
