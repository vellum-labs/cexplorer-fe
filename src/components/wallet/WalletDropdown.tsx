import { walletInfos } from "@/constants/wallet";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { formatString } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { Link } from "@tanstack/react-router";
import {
  GalleryHorizontalEnd,
  Shield,
  Star,
  Unlink,
  User,
  Wallet,
} from "lucide-react";
import { memo } from "react";
import { Badge } from "../global/badges/Badge";
import Dollar from "../../resources/images/dollar.svg";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import DiscordLogo from "../../resources/images/icons/discord.svg";
import GithubLogo from "../../resources/images/icons/github.svg";
import TelegramLogo from "../../resources/images/icons/telegram.svg";
import TwitterLogo from "../../resources/images/icons/twitter.svg";

interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchWallet: () => void;
  address: string;
  walletType: string;
  balance: number;
  isLoading: boolean;
  userData: any;
}

const WalletDropdown = ({
  isOpen,
  onClose,
  onSwitchWallet,
  address,
  walletType,
  balance,
  isLoading,
  userData,
}: WalletDropdownProps) => {
  const { disconnect } = useConnectWallet();

  const {
    profilePicture,
    profileName,
    adaHandle,
    livePool,
    drep,
    nftCount,
    hasAdmin,
    hasMembership,
  } = userData;

  const handleDisconnect = () => {
    if (walletType === "nufiSSO" || walletType === "nufiSnap") {
      nufiCoreSdk.getApi().hideWidget();
    }
    disconnect();
    const walletChannel = new BroadcastChannel("wallet_channel");
    walletChannel.postMessage({
      type: "WALLET_DISCONNECTED",
    });
    onClose();
  };

  const handleSwitchWallet = () => {
    onSwitchWallet();
    onClose();
  };

  return (
    <div
      className='absolute bottom-[calc(100%+3px)] right-0 z-30 w-[280px] rounded-m border border-border bg-cardBg p-0 text-text-sm font-medium shadow-md md:bottom-auto md:top-[calc(100%+3px)] md:w-[320px]'
      style={{
        visibility: isLoading || !isOpen ? "hidden" : "visible",
      }}
    >
      <div className='border-b border-border p-2'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-1'>
            <div className='relative'>
              <img
                className='h-10 w-10 rounded-max'
                src={profilePicture || "https://ix.cexplorer.io/default.png"}
                alt='User avatar'
              />
              <img
                className='absolute -bottom-1 -right-1 h-5 w-5 rounded-max border border-white bg-white'
                src={walletInfos[walletType]?.icon || ""}
                alt='Wallet icon'
              />
            </div>
            <div className='flex max-w-[120px] flex-col'>
              <span className='truncate text-text-sm font-medium leading-5 text-text'>
                {profileName || "Anonymous User"}
              </span>
              <div className='flex items-center gap-1'>
                <Link
                  to='/address/$address'
                  params={{ address }}
                  className='cursor-pointer text-text-sm leading-5 text-secondaryText hover:text-primary'
                >
                  {formatString(address, "short")}
                </Link>
                <Copy copyText={address} />
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end gap-1/2'>
            {hasMembership ? (
              <span className='flex w-fit items-center gap-1/2 rounded-max bg-gradient-to-r from-darkBlue to-purple-700 px-1 py-1/4 text-right text-text-xs font-medium text-white'>
                PRO
              </span>
            ) : (
              <Link
                to='/pro'
                className='gold-shimmer cursor-pointer bg-purpleText bg-clip-text text-text-xs font-medium leading-[18px] text-transparent underline hover:text-transparent'
              >
                Get PRO
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='border-b border-border p-1.5'>
        <div className='space-y-2 rounded-m border border-border bg-gradient-to-r from-cardBg to-background px-1.5 py-1.5'>
          {adaHandle && (
            <div className='flex items-center justify-between'>
              <span className='text-text-xs font-medium text-text'>
                ADA Handle
              </span>
              <Badge color='gray' rounded>
                <img src={Dollar} alt='dollar' />
                <span>
                  {encodeAssetName(
                    adaHandle.replace(/^(000de140|0014df10|000643b0)/, ""),
                  )}
                </span>
              </Badge>
            </div>
          )}

          <div className='flex items-center justify-between'>
            <span className='text-text-xs font-medium text-text'>
              ADA Balance
            </span>
            <span className='text-text-sm font-medium text-text'>
              {lovelaceToAda(balance)}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-text-xs font-medium text-text'>Pool</span>
            <div className='flex items-center gap-1/2'>
              {livePool && livePool.id ? (
                <Link
                  to='/pool/$id'
                  params={{ id: livePool.id }}
                  className='flex cursor-pointer items-center gap-1/2 hover:text-primary'
                  onClick={onClose}
                >
                  <img
                    src={generateImageUrl(livePool.id, "sm", "pool")}
                    alt='Pool icon'
                    className='h-4 w-4 rounded-max'
                  />
                  <span className='text-text-sm font-medium text-primary'>
                    {livePool.meta?.ticker ||
                      formatString(livePool.id, "short")}
                  </span>
                </Link>
              ) : (
                <Link
                  to='/pool'
                  className='cursor-pointer text-text-sm font-medium text-secondaryText hover:text-primary'
                >
                  Browse pools
                </Link>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-text-xs font-medium text-text'>DRep</span>
            <div className='flex items-center gap-1/2'>
              {drep && drep.id ? (
                <>
                  {drep.id === "drep_always_abstain" ? (
                    <span className='text-text-sm font-medium text-text'>
                      Always Abstain
                    </span>
                  ) : drep.id === "drep_always_no_confidence" ? (
                    <span className='text-text-sm font-medium text-text'>
                      No Confidence
                    </span>
                  ) : (
                    <Link
                      to='/drep/$hash'
                      params={{ hash: drep.id }}
                      className='flex cursor-pointer items-center gap-1/2 hover:text-primary'
                      onClick={onClose}
                    >
                      <img
                        src={generateImageUrl(drep.id, "sm", "drep")}
                        alt='DRep icon'
                        className='h-4 w-4 rounded-max'
                      />
                      <span className='max-w-[120px] truncate text-text-sm font-medium text-primary'>
                        {drep.meta?.given_name ||
                          formatString(drep.id, "short")}
                      </span>
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to='/drep'
                  className='cursor-pointer text-text-sm font-medium text-secondaryText hover:text-primary'
                >
                  Browse DReps
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='border-b border-border p-1'>
        <Link
          to='/watchlist'
          className='relative rounded-m text-text-sm hover:bg-darker hover:text-primary'
          style={{
            display: "block",
            padding: "10px",
          }}
          onClick={onClose}
        >
          <div className='flex items-center gap-1.5'>
            <Star size={16} className='text-gray-500' />
            Watchlist
          </div>
        </Link>

        <Link
          to='/profile'
          search={{ tab: "pro" }}
          className='relative rounded-m text-text-sm hover:bg-darker hover:text-primary'
          style={{
            display: "block",
            padding: "10px",
          }}
          onClick={onClose}
        >
          <div className='flex items-center justify-between gap-1.5'>
            <div className='flex items-center gap-1.5'>
              <GalleryHorizontalEnd size={16} className='text-gray-500' />
              Cexplorer NFTs
            </div>
            <span className='text-text-sm'>{nftCount}</span>
          </div>
        </Link>

        <Link
          to='/profile'
          className='relative rounded-m text-text-sm hover:bg-darker hover:text-primary'
          style={{
            display: "block",
            padding: "10px",
          }}
          onClick={onClose}
        >
          <div className='flex items-center gap-1.5'>
            <User size={16} className='text-gray-500' />
            Profile
          </div>
        </Link>

        {hasAdmin && (
          <Link
            to='/admin'
            className='relative rounded-m text-text-sm hover:bg-darker hover:text-primary'
            style={{
              display: "block",
              padding: "10px",
            }}
            onClick={onClose}
          >
            <div className='flex items-center gap-1.5'>
              <Shield size={16} className='text-gray-500' />
              Admin
            </div>
          </Link>
        )}
      </div>

      <div className='border-b border-border p-1'>
        <button
          className='relative w-full rounded-m text-text-sm hover:bg-darker hover:text-primary'
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleSwitchWallet}
        >
          <div className='flex items-center gap-1.5'>
            <Wallet size={16} className='text-gray-500' />
            Switch wallet
          </div>
        </button>

        <button
          className='relative w-full rounded-m text-text-sm text-red-500 hover:bg-darker'
          style={{
            display: "block",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDisconnect}
        >
          <div className='flex items-center gap-1.5'>
            <Unlink size={16} className='text-red-500' />
            Disconnect wallet
          </div>
        </button>
      </div>

      <div className='p-2'>
        <div className='flex justify-start gap-1.5'>
          <a
            href='https://x.com/cexplorer_io'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src={TwitterLogo}
              alt='Twitter'
              width={20}
              height={20}
              className='opacity-60 transition-opacity hover:opacity-100'
            />
          </a>
          <a
            href='https://discord.gg/PGCmmQC3dj'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src={DiscordLogo}
              alt='Discord'
              width={20}
              height={20}
              className='opacity-60 transition-opacity hover:opacity-100'
            />
          </a>
          <a
            href='https://t.me/cexplorer'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src={TelegramLogo}
              alt='Telegram'
              width={20}
              height={20}
              className='opacity-60 transition-opacity hover:opacity-100'
            />
          </a>
          <img
            src={GithubLogo}
            alt='Github'
            width={20}
            height={20}
            className='cursor-pointer opacity-60 transition-opacity hover:opacity-100'
          />
        </div>
      </div>
    </div>
  );
};

export default memo(WalletDropdown);
