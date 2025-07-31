import { BrandAssetsPage } from "@/pages/article/BrandAssetsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/brand-assets/")({
  component: () => <BrandAssetsPage />,
});
