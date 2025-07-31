import { PoolAnalytics } from "@/pages/analytics/PoolAnalytics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics/pool")({
  component: () => <PoolAnalytics />,
});
