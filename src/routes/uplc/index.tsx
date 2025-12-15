import { UplcPage } from "@/pages/uplc/UplcPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/uplc/")({
  component: UplcPage,
});
