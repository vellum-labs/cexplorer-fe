import { GroupDetailPage } from "@/pages/groups/GroupDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groups/$url")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GroupDetailPage />;
}
