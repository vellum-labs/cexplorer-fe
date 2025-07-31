import TxDetailPage from "@/pages/tx/TxDetailPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/tx/$hash")({
  component: TxDetailPage,
  validateSearch: input => {
    return z
      .object({
        tab: z.string().optional().catch("overview"),
        subTab: z.string().optional(),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
      })
      .parse(input);
  },
});
