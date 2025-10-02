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
      let isFromHex = false;

      if (
        /^[0-9a-fA-F]+$/.test(addressInput) &&
        addressInput.length % 2 === 0 &&
        addressInput.length >= 58
      ) {
        try {
          const hexBytes = Address.fromHexString(addressInput);
          const header = hexBytes[0];
          const network = header & 0x0f;
          const addressType = (header >> 4) & 0x0f;

          let prefix: string;
          if (addressType === 14 || addressType === 15) {
            prefix = network === 1 ? "stake" : "stake_test";
          } else {
            prefix = network === 1 ? "addr" : "addr_test";
          }

          finalAddress = Address.encodeBech32(addressInput, prefix);
          isFromHex = true;
        } catch (hexError) {
          console.error("Error converting hex to address:", hexError);
          toast("Invalid hex format", {
            id: "address-error-toast",
          });
          return null;
        }
      }

      const address = Address.from(finalAddress);

      const isStakeAddress =
        finalAddress.startsWith("stake") ||
        finalAddress.startsWith("stake_test");

      let payment = "";
      let stake = "";

      if (isStakeAddress) {
        stake = address.payment;
        payment = "";
      } else {
        payment = address.payment;
        stake = address.stake;
      }

      return {
        address: finalAddress,
        magic: address.network,
        header: isFromHex
          ? Address.fromHexString(addressInput)[0]
          : (address.header << 4) | address.network,
        payment,
        stake,
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
