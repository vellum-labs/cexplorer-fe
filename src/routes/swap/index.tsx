import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SwapPage } from "@/pages/swap/SwapPage";

export const Route = createFileRoute("/swap/")({
  component: SwapPage,
  validateSearch: z.object({
    asset: z.string().optional(),
  }),
});
