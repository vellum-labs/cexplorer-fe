import { useMemo } from "react";
import { Address } from "@/utils/address/getStakeAddress";
import { toast } from "sonner";

interface LucidAddressInspector {
  address: string;
  magic: number;
  header: number;
  payment: string;
  stake: string;
}

interface UseLucidAddressInspectorResult {
  data: LucidAddressInspector | null;
  isFetching: false;
  isLoading: false;
}

export const useLucidAddressInspector = (
  addressInput?: string,
): UseLucidAddressInspectorResult => {
  const data = useMemo(() => {
    if (!addressInput?.trim()) {
      return null;
    }

    try {
      const address = Address.from(addressInput);

      return {
        address: addressInput,
        magic: address.network,
        header: address.header,
        payment: address.payment,
        stake: address.stake,
      };
    } catch (error) {
      console.error("Error parsing address:", error);
      toast("Invalid address format", {
        id: "address-error-toast",
      });
      return null;
    }
  }, [addressInput]);

  return {
    data,
    isFetching: false,
    isLoading: false,
  };
};
