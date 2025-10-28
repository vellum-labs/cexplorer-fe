import { createFileRoute } from "@tanstack/react-router";

import { SwapPage } from "@/pages/swap/SwapPage";

export const Route = createFileRoute("/swap/")({
  component: SwapPage,
});
