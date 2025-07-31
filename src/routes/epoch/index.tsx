import EpochListPage from "@/pages/epoch/EpochListPage";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/epoch/")({
  component: () => <EpochListPage />,
});
