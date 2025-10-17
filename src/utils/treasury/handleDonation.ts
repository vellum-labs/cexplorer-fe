import type { LucidEvolution } from "@lucid-evolution/lucid";
import { toast } from "sonner";
import { executeTreasuryDonation, handleDonationError } from "@/services/treasury";

interface HandleDonationParams {
  lucid: LucidEvolution | null;
  amount: string;
  cexplorerPercentage: number;
  comment: string;
  setIsSubmitting: (value: boolean) => void;
  onSuccess: (hash: string) => void;
}

export const handleDonation = async ({
  lucid,
  amount,
  cexplorerPercentage,
  comment,
  setIsSubmitting,
  onSuccess,
}: HandleDonationParams) => {
  if (!lucid) {
    toast.error("Wallet not connected");
    return;
  }

  setIsSubmitting(true);

  try {
    const txHash = await executeTreasuryDonation({
      lucid,
      amount,
      cexplorerPercentage,
      comment,
    });

    toast.success("Donation successful!");
    onSuccess(txHash);
  } catch (error) {
    handleDonationError(error);
  } finally {
    setIsSubmitting(false);
  }
};
