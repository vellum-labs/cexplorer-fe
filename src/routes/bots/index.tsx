import { BotsPage } from "@/pages/article/BotsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bots/")({
  component: () => <BotsPage />,
});
