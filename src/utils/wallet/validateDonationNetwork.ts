import type { BrowserWallet } from "@meshsdk/core";
import { donationAddress } from "@/constants/confVariables";
import {
  isMainnetAddress,
  isTestnetAddress,
} from "@/utils/address/isMainnetAddress";

export interface NetworkValidationResult {
  valid: boolean;
  message?: string;
}

export const validateDonationNetwork = async (
  wallet: BrowserWallet,
): Promise<NetworkValidationResult> => {
  try {
    const networkId = await wallet.getNetworkId();
    const isMainnetWallet = networkId === 1;
    const isAddressMainnet = isMainnetAddress(donationAddress);
    const isAddressTestnet = isTestnetAddress(donationAddress);

    if (!isMainnetWallet && isAddressMainnet) {
      return {
        valid: false,
        message:
          "Network mismatch: Wallet is on Testnet but donation address is for Mainnet.",
      };
    }

    if (isMainnetWallet && (isAddressTestnet || !isAddressMainnet)) {
      return {
        valid: false,
        message:
          "Network mismatch: Wallet is on Mainnet but donation address is for Testnet.",
      };
    }
  } catch {
    return {
      valid: false,
      message: "Network check failed: unable to determine wallet network.",
    };
  }

  return { valid: true };
};
