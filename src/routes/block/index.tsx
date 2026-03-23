import BlocksListPage from "@/pages/blocks/BlocksListPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/block/")({
  beforeLoad: ({ search }) => {
    const s = (search as any)?.search as string | undefined;
    if (s && s.startsWith("block_no:")) {
      const value = s.slice("block_no:".length);
      if (/^[0-9a-fA-F]{64}$/.test(value)) {
        throw redirect({
          to: "/block/$hash",
          params: { hash: value },
        });
      }
    }
  },
  component: BlocksListPage,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
        sort: z.enum(["asc", "desc"]).optional().catch("desc"),
        order: z
          .enum(["block_no", "slot_no", "epoch_no", "size", "tx_count"])
          .optional()
          .catch("block_no"),
        search: z.string().optional(),
      })
      .parse(input),
});
