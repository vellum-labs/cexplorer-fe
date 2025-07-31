import { PagesAdminPage } from "@/pages/admin/PagesAdminPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/pages/")({
  component: () => <PagesAdminPage />,
});
