import { PollsListPage } from "@/pages/polls/PollsListPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/polls/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PollsListPage />;
}
