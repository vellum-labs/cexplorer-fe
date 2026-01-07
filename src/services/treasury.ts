import { handleFetch } from "@/lib/handleFetch";
import type { TreasuryDonationStatsResponse } from "@/types/treasuryTypes";
import { useQuery } from "@tanstack/react-query";
import type { BrowserWallet } from "@meshsdk/core";
import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
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
  wallet: BrowserWallet;
  amount: string;
  cexplorerPercentage: number;
  comment?: string;
}

export const validateDonationNetwork = async (
  wallet: BrowserWallet,
): Promise<boolean> => {
  try {
    const networkId = await wallet.getNetworkId();
    const isMainnetWallet = networkId === 1;
    const isMainnetAddress = donationAddress.startsWith("addr1q");
    const isTestnetAddress = donationAddress.startsWith("addr_test");

    if (!isMainnetWallet && isMainnetAddress) {
      toast.error(
        "Network mismatch: Wallet is on Testnet but donation address is for Mainnet. Please use the Mainnet site.",
      );
      return false;
    }

    if (isMainnetWallet && (isTestnetAddress || !isMainnetAddress)) {
      toast.error(
        "Network mismatch: Wallet is on Mainnet but donation address is for Testnet. Please use the Testnet site.",
      );
      return false;
    }
  } catch (error) {
    console.error("Network check error:", error);
  }

  return true;
};

export const executeTreasuryDonation = async ({
  wallet,
  amount,
  cexplorerPercentage,
  comment,
}: DonationParams): Promise<string> => {
  if (!wallet || !amount || Number(amount) <= 0) {
    throw new Error("Please enter a valid amount");
  }

  if (!(await validateDonationNetwork(wallet))) {
    throw new Error("Network validation failed");
  }

  const totalAda = Number(amount);
  const pctForCexp = cexplorerPercentage / 100;

  const toCexp = BigInt(Math.floor(totalAda * pctForCexp * 1_000_000));
  const toTreasury = BigInt(
    Math.floor(totalAda * (1 - pctForCexp) * 1_000_000),
  );

  const apiKey = import.meta.env.VITE_APP_BLOCKFROST_KEY;

  const provider = new BlockfrostProvider(apiKey);
  const utxos = await wallet.getUtxos();
  const changeAddress = await wallet.getChangeAddress();

  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    evaluator: provider,
  });

  if (comment?.trim()) {
    txBuilder.metadataValue(674, { msg: [comment] });
  }

  if (toTreasury > 0n) {
    if (typeof (txBuilder as any).treasuryDonation === "function") {
      (txBuilder as any).treasuryDonation(toTreasury.toString());
    } else {
      toast.error(
        "Treasury donation not supported in current MeshJS version. Sending all to Cexplorer.",
      );
      txBuilder.txOut(donationAddress, [
        { unit: "lovelace", quantity: (toCexp + toTreasury).toString() },
      ]);

      const unsignedTx = await txBuilder
        .selectUtxosFrom(utxos)
        .changeAddress(changeAddress)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      sendDelegationInfo(txHash, "lovelace_cexplorer", "donate");
      return txHash;
    }
  }

  if (toCexp > 0n) {
    txBuilder.txOut(donationAddress, [
      { unit: "lovelace", quantity: toCexp.toString() },
    ]);
  }

  const unsignedTx = await txBuilder
    .selectUtxosFrom(utxos)
    .changeAddress(changeAddress)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  const campaigns = [
    toTreasury > 0n ? "lovelace_treasury" : null,
    toCexp > 0n ? "lovelace_cexplorer" : null,
  ]
    .filter(Boolean)
    .join(",");

  sendDelegationInfo(txHash, campaigns, "donate");

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
