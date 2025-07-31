import { TreasuryDonationPage } from "@/pages/treasury/TreasuryDonationPage";
import type { PaginatedSearchParams } from "@/types/tableTypes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/treasury/donation")({
  component: () => <TreasuryDonationPage />,
  validateSearch: (input: PaginatedSearchParams) => {
    return z
      .object({
        page: z
          .preprocess(val => Number(val), z.number().min(1))
          .optional()
          .catch(1),
        limit: z.number().optional().catch(20),
      })
      .parse(input);
  },
});
