import { BountyPage } from "@/pages/article/BountyPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bounty/")({
  component: BountyPage,
});
