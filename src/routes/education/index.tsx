import { EducationPage } from "@/pages/article/EducationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/education/")({
  component: () => <EducationPage />,
});
