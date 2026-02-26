import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/pages/portfolio/PortfolioPage";

export const Route = createFileRoute("/portfolio/")({
  component: () => <PortfolioPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
  }),
});
