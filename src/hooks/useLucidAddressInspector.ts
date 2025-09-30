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
}

export const useLucidAddressInspector = (
  addressInput?: string,
): UseLucidAddressInspectorResult => {
  const data = useMemo(() => {
    if (!addressInput?.trim()) {
      return null;
    }

    try {
      let finalAddress = addressInput;

      if (
        /^[0-9a-fA-F]+$/.test(addressInput) &&
        addressInput.length % 2 === 0
      ) {
        try {
          const hexBytes = Address.fromHexString(addressInput);
          const header = hexBytes[0];
          const network = header & 0x0f;

          let prefix: string;
          const addressType = (header >> 4) & 0x0f;

          if (addressType >= 14) {
            prefix = network === 1 ? "stake" : "stake_test";
          } else {
            prefix = network === 1 ? "addr" : "addr_test";
          }

          finalAddress = Address.encodeBech32(addressInput, prefix);
        } catch (hexError) {
          console.error("Error converting hex to address:", hexError);
          toast("Invalid hex format", {
            id: "address-error-toast",
          });
          return null;
        }
      }

      const address = Address.from(finalAddress);

      return {
        address: finalAddress,
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
  };
};
