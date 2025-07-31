import type { PaginatedSearchParams } from "@/types/tableTypes";

import { ScriptListPage } from "@/pages/script/ScriptListPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/script/")({
  component: () => <ScriptListPage />,
  validateSearch: (
    input: PaginatedSearchParams & {
      order: "tx" | "redeemer.count" | "tx_payment_cred.out.sum";
    },
  ) => {
    return z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        order: z.string().optional().catch("tx"),
      })
      .parse(input);
  },
});
