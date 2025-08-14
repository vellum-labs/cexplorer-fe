import { GovernanceCrossroadsPage } from "@/pages/governance/GovernanceCrossroadsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gov/")({
  component: () => <GovernanceCrossroadsPage />,
});
