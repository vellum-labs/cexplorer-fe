import BlockDetail from "@/pages/blocks/BlockDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/block/$hash")({
  component: BlockDetail,
});
