import { EpochCalendarPage } from "@/pages/epoch/EpochCalendarPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/epoch/calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EpochCalendarPage />;
}
