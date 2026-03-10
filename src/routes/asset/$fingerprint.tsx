import { AssetDetailPage } from "@/pages/assets/AssetDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { fetchMiscSearch } from "@/services/misc";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { z } from "zod";

const AssetRoute = () => {
  const { assetNotFound } = Route.useRouteContext();
  if (assetNotFound) return <NotFoundPage />;
  return <AssetDetailPage />;
};

export const Route = createFileRoute("/asset/$fingerprint")({
  beforeLoad: async ({ params, search }) => {
    const { fingerprint } = params;
    if (fingerprint.startsWith("asset1")) return { assetNotFound: false };

    try {
      const { getAssetFingerprint } = await import("@vellumlabs/cexplorer-sdk");
      const resolved = getAssetFingerprint(fingerprint);
      const result = await fetchMiscSearch(resolved, "asset");
      const data = result?.data;
      const found = Array.isArray(data)
        ? data.some(item => item.category === "asset")
        : data?.category === "asset";

      if (found) {
        throw redirect({
          to: "/asset/$fingerprint",
          params: { fingerprint: resolved },
          search,
        });
      }
      return { assetNotFound: true };
    } catch (e) {
      if (isRedirect(e)) throw e;
      return { assetNotFound: true };
    }
  },
  component: AssetRoute,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
      })
      .parse(input),
});
