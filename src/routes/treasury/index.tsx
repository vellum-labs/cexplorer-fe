import { TreasuryPage } from "@/pages/treasury/TreasuryPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/treasury/")({
  component: () => <TreasuryPage />,
});
