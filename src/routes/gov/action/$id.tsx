import type { PaginatedSearchParams } from "@/types/tableTypes";

import { GovernanceDetailPage } from "@/pages/governance/GovernanceDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { fetchMiscSearch } from "@/services/misc";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

import { z } from "zod";

const GovActionRoute = () => {
  const { actionNotFound } = Route.useRouteContext();
  if (actionNotFound) return <NotFoundPage />;
  return <GovernanceDetailPage />;
};

export const Route = createFileRoute("/gov/action/$id")({
  beforeLoad: async ({ params, search }) => {
    const { id } = params;

    if (!id.startsWith("gov_action")) return { actionNotFound: false };

    try {
      const result = await fetchMiscSearch(id, "gov_action_proposal");
      const data = result?.data;
      const items = Array.isArray(data) ? data : data ? [data] : [];
      const action = items.find(
        item => item.category === "gov_action_proposal",
      );

      if (action) {
        const rawId = action.url.replace("/gov/action/", "");
        const encodedId = rawId.replace("#", "%23");
        throw redirect({
          to: "/gov/action/$id",
          params: { id: encodedId },
          search,
        });
      }
      return { actionNotFound: true };
    } catch (e) {
      if (isRedirect(e)) throw e;
      return { actionNotFound: true };
    }
  },
  component: GovActionRoute,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        order: z.enum(["stake", "represented_by"]).optional().catch("stake"),
        sort: z.enum(["asc", "desc"]).optional().catch("asc"),
      })

      .parse(input),
});
