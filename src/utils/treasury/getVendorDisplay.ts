import type { VendorContract } from "@/services/vendorContracts";

export const getVendorDisplay = (contract: VendorContract) => {
  if (contract.vendor_address?.startsWith("addr")) {
    return { type: "address" as const, value: contract.vendor_address };
  }
  if (contract.vendor_address) {
    return { type: "text" as const, value: contract.vendor_address };
  }
  if (contract.vendor_name) {
    return { type: "text" as const, value: contract.vendor_name };
  }
  return { type: "text" as const, value: "-" };
};
