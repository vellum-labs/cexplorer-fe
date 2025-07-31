import { PrivacyPage } from "@/pages/article/PrivacyPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PrivacyPage />;
}
