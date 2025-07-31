import type { PaginatedSearchParams } from "@/types/tableTypes";

import { DatumPage } from "@/pages/datum/DatumPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/datum/")({
  component: () => <DatumPage />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        datum: z.string().optional().catch(""),
        hash: z.string().optional().catch(""),
      })
      .parse(input),
});
