import { PromotionPage } from "@/pages/article/PromotionPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/promotion/")({
  component: () => <PromotionPage />,
});
