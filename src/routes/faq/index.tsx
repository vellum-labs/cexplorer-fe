import { FaqPage } from "@/pages/article/FaqPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq/")({
  component: () => <FaqPage />,
});
