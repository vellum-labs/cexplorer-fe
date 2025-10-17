import { handleFetch } from "@/lib/handleFetch";
import type { TreasuryDonationStatsResponse } from "@/types/treasuryTypes";
import { useQuery } from "@tanstack/react-query";
import type { LucidEvolution } from "@lucid-evolution/lucid";
import { donationAddress } from "@/constants/confVariables";
import { sendDelegationInfo } from "@/services/tool";
import { toast } from "sonner";

export const fetchTreasuryDonationStats = async () => {
  const url = "/analytics/treasury";

  return handleFetch<TreasuryDonationStatsResponse>(url);
};

export const useFetchTreasuryDonationStats = () => {
  return useQuery({
    queryKey: ["treasury-donation-stats"],
    queryFn: async () => {
      const { data } = await fetchTreasuryDonationStats();

      return data;
    },
  });
};

interface DonationParams {
  lucid: LucidEvolution;
  amount: string;
  cexplorerPercentage: number;
  comment?: string;
}

export const validateDonationNetwork = (lucid: LucidEvolution): boolean => {
  try {
    const lucidNetwork = lucid.config().network;
    const isMainnetAddress = donationAddress.startsWith("addr1q");
    const isTestnetAddress = donationAddress.startsWith("addr_test");

    if (lucidNetwork === "Preprod" && isMainnetAddress) {
      toast.error(
        "Network mismatch: Wallet is on Preprod but donation address is for Mainnet. Please use the Preprod site.",
      );
      return false;
    }

    if (
      lucidNetwork === "Mainnet" &&
      (isTestnetAddress || !isMainnetAddress)
    ) {
      toast.error(
        "Network mismatch: Wallet is on Mainnet but donation address is for Testnet. Please use the Mainnet site.",
      );
      return false;
    }
  } catch (error) {
    console.error("Network check error:", error);
  }

  return true;
};

export const executeTreasuryDonation = async ({
  lucid,
  amount,
  cexplorerPercentage,
  comment,
}: DonationParams): Promise<string> => {
  if (!lucid || !amount || Number(amount) <= 0) {
    throw new Error("Please enter a valid amount");
  }

  if (!validateDonationNetwork(lucid)) {
    throw new Error("Network validation failed");
  }

  const totalAda = Number(amount);
  const pctForCexp = cexplorerPercentage / 100;

  const toCexp = BigInt(Math.floor(totalAda * pctForCexp * 1_000_000));
  const toTreasury = BigInt(
    Math.floor(totalAda * (1 - pctForCexp) * 1_000_000),
  );

  let tx = lucid.newTx();

  if (comment?.trim()) {
    tx = tx.attachMetadata(674, { msg: [comment] });
  }

  if (toTreasury > 0n) {
    switch (true) {
      case typeof (tx as any).donate === "object" &&
        typeof (tx as any).donate.ToTreasury === "function": {
        tx = (tx as any).donate.ToTreasury(toTreasury);
        break;
      }
      case typeof (tx as any).addDonation === "function": {
        tx = (tx as any).addDonation(toTreasury);
        break;
      }
      case typeof (tx as any).setDonation === "function": {
        tx = (tx as any).setDonation(toTreasury);
        break;
      }
      default: {
        toast.error(
          "Treasury donation not supported in current Lucid version. Sending all to Cexplorer.",
        );
        tx = tx.pay.ToAddress(donationAddress, {
          lovelace: toCexp + toTreasury,
        });

        const completed = await tx.complete();
        const signed = await completed.sign.withWallet();
        const signedTx = await signed.complete();
        const txHash = await signedTx.submit();

        sendDelegationInfo(txHash, "lovelace_cexplorer", "donate");
        lucid.awaitTx(txHash);
        return txHash;
      }
    }
  }

  if (toCexp > 0n) {
    tx = tx.pay.ToAddress(donationAddress, { lovelace: toCexp });
  }

  const completed = await tx.complete();
  const signed = await completed.sign.withWallet();
  const signedTx = await signed.complete();
  const txHash = await signedTx.submit();

  const campaigns = [
    toTreasury > 0n ? "lovelace_treasury" : null,
    toCexp > 0n ? "lovelace_cexplorer" : null,
  ]
    .filter(Boolean)
    .join(",");

  sendDelegationInfo(txHash, campaigns, "donate");
  lucid.awaitTx(txHash);

  return txHash;
};

export const handleDonationError = (error: any): void => {
  console.error("Treasury donation error:", error);

  const errorString = JSON.stringify(error);
  const errorMessage = error?.message || "";

  if (
    errorString.includes("user declined signing") ||
    errorString.includes("TxSignError") ||
    errorMessage.includes("user declined") ||
    errorMessage.includes("cancelled") ||
    errorMessage.includes("rejected")
  ) {
    toast.error("Transaction cancelled by user");
  } else {
    toast.error(errorMessage || "Donation failed. Please try again.");
  }
};
