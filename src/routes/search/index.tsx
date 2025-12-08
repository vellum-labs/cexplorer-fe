import { createFileRoute } from "@tanstack/react-router";

import { SearchPage } from "@/pages/search/SearchPage";
import z from "zod";

export const Route = createFileRoute("/search/")({
  component: SearchPage,
  validateSearch: input => {
    return z
      .object({
        query: z.string().optional(),
      })
      .parse(input);
  },
});
