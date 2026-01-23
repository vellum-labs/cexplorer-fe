import { PotsPage } from "@/pages/pot/PotsPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/pot/")({
  component: PotsPage,
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
