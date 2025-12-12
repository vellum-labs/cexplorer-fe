import { WikiAdminPage } from "@/pages/admin/WikiAdminPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/wiki/")({
  component: () => <WikiAdminPage />,
});
