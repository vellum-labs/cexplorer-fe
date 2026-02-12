import { TreasuryContractsPage } from "@/pages/treasury/TreasuryContractsPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/treasury/contracts/")({
  component: () => <TreasuryContractsPage />,
  validateSearch: (input: PaginatedSearchParams) => {
    return z
      .object({
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
      })
      .parse(input);
  },
});
