import { PoolDebugPage } from "@/pages/pool-debug/PoolDebugPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pool-debug/$poolId")({
  component: () => <PoolDebugPage />,
});
