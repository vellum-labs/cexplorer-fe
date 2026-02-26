import { PayPage } from "@/pages/pay/PayPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/pay/")({
  component: PayPage,
  validateSearch: z.object({
    to: z.string().optional(),
    handle: z.string().optional(),
    amount: z.coerce.string().optional(),
    donation: z.coerce.string().optional(),
    message: z.string().optional(),
  }),
});
