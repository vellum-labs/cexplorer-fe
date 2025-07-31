import { PowerThresholdsPage } from "@/pages/governance/PowerThresholdsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gov/power-thresholds/")({
  component: PowerThresholdsPage,
});
