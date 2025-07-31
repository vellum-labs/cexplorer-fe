import { createFileRoute } from "@tanstack/react-router";

import { DexSwapDetailPage } from "@/pages/dex/DexSwapDetailPage";

export const Route = createFileRoute("/dex/swap/$hash")({
  component: DexSwapDetailPage,
});
