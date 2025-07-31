import { ProPage } from "@/pages/article/ProPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pro/")({
  component: () => <ProPage />,
});
