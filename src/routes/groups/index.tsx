import { GroupsListPage } from "@/pages/groups/GroupsListPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groups/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GroupsListPage />;
}
