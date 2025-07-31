import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics/")({
  component: () => <AnalyticsPage />,
});
