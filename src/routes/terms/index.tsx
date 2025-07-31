import { TermsPage } from "@/pages/article/TermsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms/")({
  component: () => <TermsPage />,
});
