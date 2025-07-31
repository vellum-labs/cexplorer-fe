import { NewsletterPage } from "@/pages/article/NewsletterPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/newsletter/")({
  component: () => <NewsletterPage />,
});
