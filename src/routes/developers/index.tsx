import { DevelopersPage } from "@/pages/article/DevelopersPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/developers/")({
  component: () => <DevelopersPage />,
});
