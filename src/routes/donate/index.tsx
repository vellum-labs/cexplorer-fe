import { DonatePage } from "@/pages/donate/DonatePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/donate/")({
  component: () => <DonatePage />,
});
