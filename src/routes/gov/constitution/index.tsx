import { ConstitutionPage } from "@/pages/governance/ConstitutionPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gov/constitution/")({
  component: ConstitutionPage,
});
