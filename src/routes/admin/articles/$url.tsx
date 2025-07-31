import { AdminArticleDetail } from "@/pages/admin/AdminArticleDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/articles/$url")({
  component: () => <AdminArticleDetail />,
  validateSearch: (search: { lang?: string }) => {
    return {
      lang: search.lang,
    };
  },
});
