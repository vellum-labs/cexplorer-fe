import { WikiDetailPage } from "@/pages/wiki/WikiDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wiki/$url")({
  component: () => <WikiDetailPage />,
});
