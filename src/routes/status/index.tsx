import { StatusPage } from "@/pages/status/StatusPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/status/")({
  component: StatusPage,
});
