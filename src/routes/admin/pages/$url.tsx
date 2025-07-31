import { AdminPageDetail } from "@/pages/admin/AdminPageDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/pages/$url")({
  component: () => <AdminPageDetail />,
  validateSearch: (search: { lang?: string }) => {
    return {
      lang: search.lang,
    };
  },
});
