import type { BrowserWallet } from "@meshsdk/core";
import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { callPaymentToast } from "../error/callPaymentToast";
import { donationAddress } from "@/constants/confVariables";
import { validateDonationNetwork } from "./validateDonationNetwork";

interface PaymentParams {
  toAddress: string;
  amount: number;
  donationAmount?: number;
}

export const handlePayment = async (
  params: PaymentParams,
  wallet: BrowserWallet | null,
): Promise<string | undefined> => {
  if (!wallet) {
    callPaymentToast({
      errorMessage: "Wallet not connected. Please connect your wallet first.",
    });
    return;
  }

  const { toAddress, amount, donationAmount = 0 } = params;

  if (!toAddress) {
    callPaymentToast({ errorMessage: "Missing recipient address." });
    return;
  }

  if (!amount || amount <= 0) {
    callPaymentToast({ errorMessage: "Invalid amount." });
    return;
  }

  const utxos = await wallet.getUtxos();
  if (!utxos || !utxos.length) {
    callPaymentToast({
      errorMessage: "Wallet has no UTxOs. Please fund your wallet first.",
    });
    return;
  }

  try {
    if (donationAmount > 0) {
      const networkCheck = await validateDonationNetwork(wallet);
      if (!networkCheck.valid) {
        callPaymentToast({ errorMessage: networkCheck.message });
        return;
      }
    }

    const apiKey = import.meta.env.VITE_APP_BLOCKFROST_KEY;
    const provider = new BlockfrostProvider(apiKey);
    const changeAddress = await wallet.getChangeAddress();

    const txBuilder = new MeshTxBuilder({
      fetcher: provider,
      evaluator: provider,
    });

    const amountLovelace = amount * 1_000_000;
    txBuilder.txOut(toAddress, [
      { unit: "lovelace", quantity: amountLovelace.toString() },
    ]);

    if (donationAmount > 0) {
      const donationLovelace = donationAmount * 1_000_000;
      txBuilder.txOut(donationAddress, [
        { unit: "lovelace", quantity: donationLovelace.toString() },
      ]);
    }

    const unsignedTx = await txBuilder
      .selectUtxosFrom(utxos)
      .changeAddress(changeAddress)
      .complete();

    const signedTx = await wallet.signTx(unsignedTx);
    const hash = await wallet.submitTx(signedTx);

    callPaymentToast({ success: true });
    return hash;
  } catch (e: any) {
    console.error("Payment error:", e);

    const errorString = JSON.stringify(e);
    const errorMessage = e?.message || "";
    const errorInfo = e?.cause?.failure?.cause?.info || "";

    if (
      errorString.includes("user declined signing") ||
      errorString.includes("TxSignError") ||
      errorString.includes("DataSignError") ||
      errorInfo.includes("user declined signing") ||
      errorMessage.includes("user declined") ||
      errorMessage.includes("cancelled") ||
      errorMessage.includes("rejected")
    ) {
      callPaymentToast({
        errorMessage: "Transaction cancelled by user",
      });
      return;
    }

    if (
      errorString.includes("ledger") ||
      errorString.includes("hardware") ||
      errorMessage.includes("device not found") ||
      errorMessage.includes("connection")
    ) {
      callPaymentToast({
        errorMessage:
          "Hardware wallet connection issue. Please check your device connection.",
      });
      return;
    }

    let friendlyMessage = "Payment failed. Please try again.";

    if (errorMessage) {
      friendlyMessage = errorMessage;
    } else if (errorInfo) {
      friendlyMessage = errorInfo;
    }

    callPaymentToast({
      errorMessage: friendlyMessage,
    });
  }
};
