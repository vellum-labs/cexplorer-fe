import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/address/")({
  component: () => <div>Hello /address/!</div>,
});
