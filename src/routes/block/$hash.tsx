import BlockDetail from "@/pages/blocks/BlockDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { fetchMiscSearch } from "@/services/misc";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

const BlockRoute = () => {
  const { blockNotFound } = Route.useRouteContext();
  if (blockNotFound) return <NotFoundPage />;
  return <BlockDetail />;
};

export const Route = createFileRoute("/block/$hash")({
  beforeLoad: async ({ params }) => {
    const { hash } = params;

    if (/^[0-9a-fA-F]{64}$/.test(hash)) return { blockNotFound: false };

    if (!/^\d+$/.test(hash)) return { blockNotFound: true };

    try {
      const result = await fetchMiscSearch(hash, "block");
      const data = result?.data;
      const items = Array.isArray(data) ? data : data ? [data] : [];
      const block = items.find(item => item.category === "block");

      if (block) {
        throw redirect({
          to: "/block/$hash",
          params: { hash: block.ident },
        });
      }
      return { blockNotFound: true };
    } catch (e) {
      if (isRedirect(e)) throw e;
      return { blockNotFound: true };
    }
  },
  component: BlockRoute,
});
