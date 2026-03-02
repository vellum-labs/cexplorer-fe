import { ScriptVerificationPage } from "@/pages/script/ScriptVerificationPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/script/verification")({
  component: () => <ScriptVerificationPage />,
  validateSearch: (input: Record<string, unknown>) =>
    z
      .object({
        hash: z.string().optional().catch(""),
      })
      .parse(input),
});
