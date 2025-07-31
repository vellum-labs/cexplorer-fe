import { PotsPage } from "@/pages/pot/PotsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pot/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PotsPage />;
}
