import { AdminGroupDetailPage } from "@/pages/admin/AdminGroupDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/groups/$url")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminGroupDetailPage />;
}
