import { AdaPrice } from "@/pages/ada-price/AdaPrice";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ada-price/")({
  component: () => <AdaPrice />,
});
