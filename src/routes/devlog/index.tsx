import { DevlogPage } from "@/pages/article/DevlogPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/devlog/")({
  component: () => <DevlogPage />,
});
