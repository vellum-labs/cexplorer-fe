import { ApiInfoPage } from "@/pages/api-info/ApiInfoPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ApiInfoPage />;
}
