import BlocksListPage from "@/pages/blocks/BlocksListPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/block/")({
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
      })
      .parse(input),
});
