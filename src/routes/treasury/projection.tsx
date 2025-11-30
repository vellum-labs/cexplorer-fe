import { createFileRoute } from "@tanstack/react-router";
import { TreasuryProjectionPage } from "@/pages/treasury/TreasuryProjectionPage";

export const Route = createFileRoute("/treasury/projection")({
  component: TreasuryProjectionPage,
});
