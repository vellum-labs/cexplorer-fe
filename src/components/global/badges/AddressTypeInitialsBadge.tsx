import { Tooltip } from "@/components/ui/tooltip";
import { getAddressTypeInitials } from "@/utils/address/getAddressTypeInitials";
import { parseShelleyAddress } from "@/utils/address/parseShelleyAddress";

interface Props {
  address: string;
  className?: string;
}

export const AddressTypeInitialsBadge = ({ address, className }: Props) => {
  const delegationPart = parseShelleyAddress(address)?.delegationPart;
  const paymentPart = parseShelleyAddress(address)?.paymentPart;

  const shouldRenderPayment =
    (paymentPart && !address.includes("stake")) ||
    (paymentPart && delegationPart !== paymentPart);
  const shouldRenderDelegation =
    delegationPart &&
    (address.includes("stake") || delegationPart !== paymentPart);

  let paymentBgColor;
  let paymentTextColor;
  let delegationBgColor;
  let delegationTextColor;

  switch (getAddressTypeInitials(paymentPart)) {
    case "PKH":
      paymentBgColor = "bg-pink-100";
      paymentTextColor = "text-pink-800";
      break;
    case "SH":
      paymentBgColor = "bg-green-100";
      paymentTextColor = "text-green-800";
      break;
    case "SKH":
      paymentBgColor = "bg-blue-100";
      paymentTextColor = "text-blue-800";
      break;
    case "PTR":
      paymentBgColor = "bg-purple-100";
      paymentTextColor = "text-purple-800";
      break;
    default:
      paymentBgColor = "bg-gray-100";
      paymentTextColor = "text-gray-800";
  }

  switch (getAddressTypeInitials(delegationPart)) {
    case "PKH":
      delegationBgColor = "bg-pink-100";
      delegationTextColor = "text-pink-800";
      break;
    case "SH":
      delegationBgColor = "bg-green-100";
      delegationTextColor = "text-green-800";
      break;
    case "SKH":
      delegationBgColor = "bg-blue-100";
      delegationTextColor = "text-blue-800";
      break;
    default:
      delegationBgColor = "bg-gray-100";
      delegationTextColor = "text-gray-800";
  }

  if (paymentPart?.includes("Key") && delegationPart?.includes("Key")) {
    return (
      <Tooltip
        content={<div className='min-w-[100px] text-center'>KeyHash</div>}
      >
        <span
          className={`flex w-fit items-center gap-1 rounded border ${paymentBgColor} px-1.5 py-0 text-right text-[10px] font-bold ${paymentTextColor} ${className}`}
        >
          KH
        </span>
      </Tooltip>
    );
  }

  return (
    <div className='flex items-center gap-1'>
      {shouldRenderPayment && (
        <Tooltip
          content={
            <div className='min-w-[100px] text-center'>{paymentPart}</div>
          }
        >
          <span
            className={`flex w-fit items-center gap-1 rounded border ${paymentBgColor} px-1.5 py-0 text-right text-[10px] font-bold ${paymentTextColor} ${className}`}
          >
            {getAddressTypeInitials(paymentPart)}
          </span>
        </Tooltip>
      )}
      {shouldRenderDelegation && (
        <Tooltip
          content={
            <div className='min-w-[100px] text-center'>{delegationPart}</div>
          }
        >
          <span
            className={`flex w-fit items-center gap-1 rounded border ${delegationBgColor} px-1.5 py-0 text-right text-[10px] font-bold ${delegationTextColor} ${className}`}
          >
            {getAddressTypeInitials(delegationPart)}
          </span>
        </Tooltip>
      )}
    </div>
  );
};
