import { VoteListPage } from "@/pages/governance/VoteListPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/gov/vote/")({
  component: VoteListPage,
  validateSearch: (input: PaginatedSearchParams) =>
    z
      .object({
        offset: z.number().optional().catch(0),
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(10),
        voter_role: z
          .enum(["SPO", "DRep", "ConstitutionalCommittee"])
          .optional(),
        vote: z.enum(["All", "Yes", "No", "Abstain"]).optional(),
      })

      .parse(input),
});
