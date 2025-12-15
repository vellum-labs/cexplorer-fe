import { PoolDebugPage } from "@/pages/pool-debug/PoolDebugPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/pool-debug/")({
  component: () => <PoolDebugPage />,
  validateSearch: (input: { pool_id?: string }) =>
    z
      .object({
        pool_id: z.string().optional(),
      })
      .parse(input),
});
