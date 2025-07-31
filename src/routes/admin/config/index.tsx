import { ConfigAdminPage } from "@/pages/admin/ConfigAdminPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/config/")({
  component: () => <ConfigAdminPage />,
});
