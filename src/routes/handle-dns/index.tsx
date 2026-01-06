import { HandleDnsPage } from "@/pages/handle-dns/HandleDnsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/handle-dns/")({
  component: HandleDnsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search?.page) || 1,
    };
  },
});
