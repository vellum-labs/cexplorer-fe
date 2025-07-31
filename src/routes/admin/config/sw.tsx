import { ConfigSwPage } from "@/pages/admin/ConfigSwPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/config/sw")({
  component: ConfigSwPage,
});
