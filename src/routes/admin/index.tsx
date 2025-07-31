import { AdminPage } from "@/pages/admin/AdminPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: () => <AdminPage />,
});
