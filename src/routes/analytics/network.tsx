import { createFileRoute } from "@tanstack/react-router";

import { NetworkAnalytics } from "@/pages/analytics/NetworkAnalytics";

export const Route = createFileRoute("/analytics/network")({
  component: () => <NetworkAnalytics />,
});
