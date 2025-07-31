import { AboutUsPage } from "@/pages/article/AboutUsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about-us/")({
  component: () => <AboutUsPage />,
});
