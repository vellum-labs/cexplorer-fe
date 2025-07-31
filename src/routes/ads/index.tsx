import { AdsPage } from "@/pages/article/AdsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ads/")({
  component: () => <AdsPage />,
});
