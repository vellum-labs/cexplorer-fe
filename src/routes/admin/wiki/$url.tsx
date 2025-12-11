import { AdminWikiDetail } from "@/pages/admin/AdminWikiDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/wiki/$url")({
  component: () => <AdminWikiDetail />,
  validateSearch: (search: { lang?: string }) => {
    return {
      lang: search.lang,
    };
  },
});
