import { createFileRoute } from "@tanstack/react-router";

import { StakingCalculatorPage } from "@/pages/staking-calculator/StakingCalculatorPage";

export const Route = createFileRoute("/rewards-calculator")({
  component: () => <StakingCalculatorPage />,
});
