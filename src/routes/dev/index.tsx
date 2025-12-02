import { DevToolingPage } from "@/pages/developers/DevToolingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dev/")({
  component: () => <DevToolingPage />,
});
