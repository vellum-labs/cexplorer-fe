import HardforkPage from "@/pages/analytics/HardforkPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hardfork/")({
  component: HardforkPage,
});
