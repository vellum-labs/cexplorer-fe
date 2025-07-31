import { configJSON } from "@/constants/conf";
import { Address } from "./getStakeAddress";

export const isValidAddress = (address: string | undefined): boolean => {
  const { network } = configJSON;

  if (!address || address.trim() === "" || address.length < 30) {
    return false;
  }

  try {
    const addrObj = Address.from(address);
    if ((addrObj as any).isByron) {
      return true;
    }
    const prefix = address.substring(0, address.lastIndexOf("1"));
    const validPrefixes =
      network === "mainnet" ? ["addr", "stake"] : ["addr_test", "stake_test"];

    return validPrefixes.includes(prefix);
  } catch {
    return false;
  }
};
