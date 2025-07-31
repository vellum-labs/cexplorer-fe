import { ContributorsPage } from "@/pages/article/ContributorsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contributors/")({
  component: () => <ContributorsPage />,
});
