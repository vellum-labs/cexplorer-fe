import { colors } from "@/constants/colors";
import { useFetchUserInfo } from "@/services/user";
import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
import { getAddressAnimalImage } from "@/utils/address/getAddressAnimalImage";
import { getAnimalRangeByAmount } from "@/utils/address/getAddressAnimalRange";
import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { parseShelleyAddress } from "@/utils/address/parseShelleyAddress";
import { formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import { Code2, KeyRound } from "lucide-react";
import Copy from "../global/Copy";
import { Tooltip } from "../ui/tooltip";
import PulseDot from "../global/PulseDot";

interface Props {
  address: string;
  amount?: number | null;
  className?: string;
  enableHover?: boolean;
  stakeKey?: string;
}

const AddressCell = ({
  address,
  amount,
  className,
  enableHover = false,
  stakeKey,
}: Props) => {
  const isStake = address.includes("stake");
  const { hoverValue, setHoverValue } = useHoverHighlightState();
  const { labels } = useAddressLabelStore();
  const { data } = useFetchUserInfo();
  const proNfts = data?.data.membership.nfts || 0;
  const sliceIndex = proNfts === 0 ? 5 : proNfts * 100;
  const label = labels
    .slice(0, sliceIndex)
    .find(label => label.ident === address)?.label;

  const handleMouseEnter = () => {
    if (enableHover) setHoverValue(address);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const isHighlighted = hoverValue === address;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='flex items-center gap-2'
        role='button'
      >
        {amount && (
          <Tooltip
            content={
              <div className='min-w-[130px] text-center'>
                {getAnimalRangeByAmount(amount)}
              </div>
            }
          >
            <img
              src={getAddressAnimalImage(amount)}
              alt='Sea animal'
              width={25}
              height={25}
            />
          </Tooltip>
        )}
        {parseShelleyAddress(address)?.paymentPart === "ScriptHash" && (
          <Tooltip
            content={
              <div className='flex w-[166px] flex-col items-center text-sm'>
                <p className='font-medium'>Smart Contract Address</p>
              </div>
            }
          >
            <div className='flex h-[15px] w-[15px] items-center justify-center rounded-full bg-darkBlue p-[2px]'>
              <Code2 size={15} strokeWidth={2.5} color='white' />
            </div>
          </Tooltip>
        )}
        <Link
          to={isStake ? "/stake/$stakeAddr" : "/address/$address"}
          params={{ address: address, stakeAddr: address }}
          className={`${label ? "px-[2px] italic" : ""} ${isHighlighted ? "rounded-md bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-sm text-primary ${className}`}
          title={label ? address : ""}
        >
          {label ? label : formatString(address, "longer")}
        </Link>
        <Copy copyText={address} />
        {isValidAddress(address) && Address.from(address).stake && (
          <Tooltip
            content={
              <div className='flex w-[200px] flex-col items-center text-sm'>
                <p className='font-medium'>Stake key</p>
                <div className='mt-1/2 flex items-end justify-end break-all text-center text-sm'>
                  <Link
                    to='/stake/$stakeAddr'
                    params={{ stakeAddr: Address.from(address).rewardAddress }}
                    className='text-primary'
                  >
                    {Address.from(address).rewardAddress}
                  </Link>
                  <Copy copyText={Address.from(address).rewardAddress} />
                </div>
              </div>
            }
          >
            <KeyRound size={15} color={colors.primary} />
          </Tooltip>
        )}
        {stakeKey && stakeKey !== Address.from(address).rewardAddress && (
          <Tooltip
            content={
              <p className='w-[200px] text-center'>
                This address belongs to a different stake key than you're
                currently viewing.
              </p>
            }
          >
            <PulseDot animate={false} color='#F79009' />
          </Tooltip>
        )}
      </div>
    </>
  );
};

export default AddressCell;
