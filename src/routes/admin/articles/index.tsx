import { ArticlesAdminPage } from "@/pages/admin/ArticlesAdminPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/articles/")({
  component: () => <ArticlesAdminPage />,
});
