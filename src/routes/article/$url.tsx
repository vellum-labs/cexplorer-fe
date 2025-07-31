import { ArticleDetailPage } from "@/pages/article/ArticleDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/article/$url")({
  component: () => <ArticleDetailPage />,
});
