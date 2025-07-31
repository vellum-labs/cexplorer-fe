import { walletInfos } from "@/constants/wallet";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useFetchUserInfo } from "@/services/user";
import { useWalletStore } from "@/stores/walletStore";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { formatString } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { getWalletBalance } from "@/utils/wallet/getWalletBalance";
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
import { useEffect, useState } from "react";
import { Badge } from "../global/badges/Badge";
import Button from "../global/Button";
import Copy from "../global/Copy";
import Dropdown from "../global/dropdowns/Dropdown";
import ConnectWalletModal from "./ConnectWalletModal";
import DelegationModal from "./DelegationModal";

interface Props {
  variant?: "short" | "long";
  onClick?: () => void;
}

const WalletButton = ({ variant = "short", onClick }: Props) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { address, walletType, walletApi, setWalletState } = useWalletStore();
  const { disconnect } = useConnectWallet();
  const [balance, setBalance] = useState(0);
  const userQuery = useFetchUserInfo();
  const userData = userQuery.data?.data;
  const nftCount = userQuery.data?.data?.membership.nfts;
  const showDelegation = userData?.account && userData?.account?.length > 0;
  const livePools = userQuery.data?.data?.account
    ?.filter(account => account.live_pool.id)
    .map(account => account.live_pool);
  const [openDelegationModal, setOpenDelegationModal] = useState(false);
  const adaHandle =
    userData?.account && userData?.account.length > 0
      ? userData?.account[0].adahandle
      : undefined;

  const walletChannel = new BroadcastChannel("wallet_channel");

  useEffect(() => {
    const handleMessage = event => {
      const { type, payload } = event.data;
      switch (type) {
        case "WALLET_CONNECTED":
          setWalletState({
            address: payload.address,
            walletType: payload.walletType,
          });
          break;
        case "WALLET_DISCONNECTED":
          disconnect();
          break;
        default:
          break;
      }
    };
    const controller = new AbortController();
    const signal = controller.signal;

    walletChannel.addEventListener("message", handleMessage, { signal });

    return () => {
      controller.abort();
    };
  }, [disconnect]);

  useEffect(() => {
    if (address && walletType) {
      walletChannel.postMessage({
        type: "WALLET_CONNECTED",
        payload: { address, walletType },
      });
    }
  }, [address, walletType]);

  useEffect(() => {
    const getBalance = async () => {
      const balance = await getWalletBalance(walletApi!);
      if (balance !== undefined) {
        setBalance(Number(balance.coin().to_str()));
      }
    };

    if (address !== undefined && walletApi !== undefined) {
      getBalance();
    }
  }, [address, walletApi]);

  return (
    <>
      {openDelegationModal && (
        <DelegationModal onClose={() => setOpenDelegationModal(false)} />
      )}
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      {!address && !walletType ? (
        <Button
          label={variant === "short" ? "Wallet" : "Connect Wallet"}
          variant='secondary'
          size='md'
          leftIcon={<Wallet size={20} />}
          onClick={() => setShowWalletModal(true)}
        />
      ) : (
        <Dropdown
          id='wallet-dropdown'
          hideChevron
          label={
            <div className='box-border flex min-w-fit max-w-fit items-center justify-between rounded-[8px] border-2 border-secondaryText bg-secondaryBg px-4 py-2 text-sm font-medium text-secondaryText duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50'>
              <span className='mr-2'>
                <img
                  className='h-[20px] min-h-[20px] w-[20px] min-w-[20px] shrink-0'
                  src={walletInfos[walletType!].icon}
                  alt='wallet'
                  height={20}
                  width={20}
                />
              </span>
              <span>
                {formatString(
                  address ?? "",
                  variant === "short" ? "shorter" : "long",
                )}
              </span>
            </div>
          }
          options={[
            {
              label: (
                <div className='flex cursor-default flex-col gap-3 hover:text-text'>
                  <div className='mb-2 flex items-center justify-between gap-1 break-all'>
                    <span>
                      {adaHandle
                        ? encodeAssetName(adaHandle)
                        : formatString(address ?? "", "longer")}
                    </span>
                    <Copy copyText={address ?? ""} />
                  </div>
                  <div className='flex w-full justify-between gap-1 text-sm'>
                    <span className=''>ADA Balance: </span>
                    <span className=''>{lovelaceToAda(balance)}</span>
                  </div>
                  {showDelegation && (
                    <div className='flex w-full items-center justify-between gap-2 text-sm'>
                      <span className='min-w-fit'>Staked with: </span>
                      <span className=''>
                        {livePools?.length === 0 && (
                          <Button
                            label='Delegate'
                            size='sm'
                            variant='primary'
                            className='h-[30px]'
                            onClick={() => setOpenDelegationModal(true)}
                          />
                        )}
                        {livePools?.map(pool => (
                          <div
                            key={pool.id}
                            className='flex items-center gap-2 text-primary'
                          >
                            <Link to={`/pool/${pool.id}`} key={pool.id}>
                              {formatString(pool.id, "short")}
                            </Link>
                            <Copy copyText={pool.id} />
                          </div>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              label: (
                <span className='flex items-center gap-2'>
                  <GalleryHorizontalEnd size={15} />
                  Cexplorer NFTs{" "}
                  {nftCount && nftCount > 0 && (
                    <Badge color='purple' rounded>
                      {nftCount}
                    </Badge>
                  )}
                </span>
              ),
              href: "/profile?tab=pro",
            },
            userData?.power?.includes("pageAdmin") ||
            userData?.power?.includes("articleAdmin")
              ? {
                  label: (
                    <span className='flex items-center gap-2' onClick={onClick}>
                      <Shield size={15} />
                      Admin
                    </span>
                  ),
                  href: "/admin",
                }
              : {},
            {
              label: (
                <span className='flex items-center gap-2' onClick={onClick}>
                  <User size={15} />
                  Profile
                </span>
              ),
              href: "/profile",
            },
            {
              label: (
                <span className='flex items-center gap-2' onClick={onClick}>
                  <Star size={15} />
                  Watchlist
                </span>
              ),
              href: "/watchlist",
            },
            {
              label: (
                <span className='flex items-center gap-2'>
                  <Wallet size={15} />
                  Switch Wallet
                </span>
              ),
              onClick: () => setShowWalletModal(true),
            },
            {
              label: (
                <span className='flex items-center gap-2'>
                  <Unlink size={15} />
                  Disconnect
                </span>
              ),
              onClick: () => {
                if (walletType === "nufiSSO" || walletType === "nufiSnap") {
                  nufiCoreSdk.getApi().hideWidget();
                }
                disconnect();
                walletChannel.postMessage({
                  type: "WALLET_DISCONNECTED",
                });
              },
            },
          ]}
          width='250px'
        />
      )}
    </>
  );
};

export default WalletButton;
