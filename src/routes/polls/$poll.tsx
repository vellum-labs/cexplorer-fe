import { PollDetailPage } from "@/pages/polls/PollDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/polls/$poll")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PollDetailPage />;
}
