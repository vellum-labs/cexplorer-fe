import type { PaginatedSearchParams } from "@/types/tableTypes";

import { createFileRoute } from "@tanstack/react-router";

import { AddressInspector } from "@/pages/address/AddressInspector";

import { z } from "zod";

export const Route = createFileRoute("/address/inspector")({
  component: () => <AddressInspector />,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        view: z.string().optional().catch(""),
      })
      .parse(input),
});
