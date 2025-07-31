export const getAddressTypeInitials = (
  type: string | null | undefined,
): string => {
  switch (type) {
    case "PaymentKeyHash":
      return "PKH";
    case "ScriptHash":
      return "SH";
    case "StakeKeyHash":
      return "SKH";
    case "Pointer":
      return "PTR";
    default:
      return "";
  }
};
