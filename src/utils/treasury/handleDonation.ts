import type { BrowserWallet } from "@meshsdk/core";
import { toast } from "sonner";
import {
  executeTreasuryDonation,
  handleDonationError,
} from "@/services/treasury";

interface HandleDonationParams {
  wallet: BrowserWallet | null;
  amount: string;
  cexplorerPercentage: number;
  comment: string;
  setIsSubmitting: (value: boolean) => void;
  onSuccess: (hash: string) => void;
}

export const handleDonation = async ({
  wallet,
  amount,
  cexplorerPercentage,
  comment,
  setIsSubmitting,
  onSuccess,
}: HandleDonationParams) => {
  if (!wallet) {
    toast.error("Wallet not connected");
    return;
  }

  setIsSubmitting(true);

  try {
    const txHash = await executeTreasuryDonation({
      wallet,
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
