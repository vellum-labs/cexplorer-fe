import { colors } from "@/constants/colors";
import { useFetchUserInfo } from "@/services/user";
import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
import { getAddressAnimalImage } from "@/utils/address/getAddressAnimalImage";
import { getAnimalRangeByAmount } from "@/utils/address/getAddressAnimalRange";
import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { parseShelleyAddress } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Code2, KeyRound } from "lucide-react";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";

interface Props {
  address: string;
  amount?: number | null;
  className?: string;
  enableHover?: boolean;
  stakeKey?: string;
  forceHighlight?: boolean;
  highlightStakeKey?: boolean;
}

const AddressCell = ({
  address,
  amount,
  className,
  enableHover = false,
  stakeKey,
  forceHighlight = false,
  highlightStakeKey = false,
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
    if (!forceHighlight) setHoverValue(null);
  };

  const isHighlighted = forceHighlight || hoverValue === address;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='flex items-center gap-1'
        role='button'
      >
        {amount != null && (
          <div onMouseEnter={() => !forceHighlight && setHoverValue(null)}>
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
          </div>
        )}
        {parseShelleyAddress(address)?.paymentPart === "ScriptHash" && (
          <div onMouseEnter={() => !forceHighlight && setHoverValue(null)}>
            <Tooltip
              content={
                <div className='flex w-[166px] flex-col items-center text-text-sm'>
                  <p className='font-medium'>Smart Contract Address</p>
                </div>
              }
            >
              <div className='flex h-[15px] w-[15px] items-center justify-center rounded-max bg-darkBlue p-[2px]'>
                <Code2 size={15} strokeWidth={2.5} color='white' />
              </div>
            </Tooltip>
          </div>
        )}
        <Link
          to={isStake ? "/stake/$stakeAddr" : "/address/$address"}
          params={{ address: address, stakeAddr: address }}
          className={`${label ? "px-[2px] italic" : ""} ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-text-sm text-primary ${className}`}
          title={label ? address : ""}
        >
          {label ? (
            label
          ) : (
            <>
              <span className='hidden md:inline'>
                {formatString(address, "longer")}
              </span>
              <span className='md:hidden'>
                {formatString(address, "shorter")}
              </span>
            </>
          )}
        </Link>
        <div onMouseEnter={() => !forceHighlight && setHoverValue(null)}>
          <Copy copyText={address} />
        </div>
        {isValidAddress(address) && Address.from(address).stake && (
          <Tooltip
            content={
              <div className='flex w-[200px] flex-col items-center text-text-sm'>
                <p className='font-medium'>Stake key</p>
                <div className='mt-1/2 flex items-end justify-end break-all text-center text-text-sm'>
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
            <Link
              to='/stake/$stakeAddr'
              params={{ stakeAddr: Address.from(address).rewardAddress }}
              onMouseEnter={() => !forceHighlight && setHoverValue(null)}
              className={`flex items-center ${highlightStakeKey ? "rounded-s bg-hoverHighlight px-1/2 outline outline-1 outline-highlightBorder" : ""}`}
            >
              <KeyRound size={15} color={colors.primary} />
            </Link>
          </Tooltip>
        )}
        {stakeKey && stakeKey !== Address.from(address).rewardAddress && (
          <div onMouseEnter={() => !forceHighlight && setHoverValue(null)}>
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
          </div>
        )}
      </div>
    </>
  );
};

export default AddressCell;
