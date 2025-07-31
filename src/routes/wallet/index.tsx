import { WalletPage } from "@/pages/article/WalletPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wallet/")({
  component: () => <WalletPage />,
});
