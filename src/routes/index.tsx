import { createFileRoute } from "@tanstack/react-router";
import { Homepage } from "../pages/homepage/HomePage";

export const Route = createFileRoute("/")({
  component: () => <Homepage />,
});
