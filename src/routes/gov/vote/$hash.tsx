import { createFileRoute } from "@tanstack/react-router";
import { GovernanceVoteDetailPage } from "@/pages/governance/VoteDetailPage";

export const Route = createFileRoute("/gov/vote/$hash")({
  component: () => <GovernanceVoteDetailPage />,
});
