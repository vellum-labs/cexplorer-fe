import type { PaginatedSearchParams } from "@/types/tableTypes";

import { createFileRoute } from "@tanstack/react-router";

import { TaxToolPage } from "@/pages/tax-tool/TaxToolPage";

import { z } from "zod";

export const Route = createFileRoute("/tax-tool")({
  component: () => <TaxToolPage />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        stake: z.string().optional().catch(""),
      })
      .parse(input),
});
