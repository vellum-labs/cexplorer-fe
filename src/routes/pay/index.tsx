import { PayPage } from "@/pages/pay/PayPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/pay/")({
  component: PayPage,
  validateSearch: z.object({
    data: z.string().optional(),
  }),
});
