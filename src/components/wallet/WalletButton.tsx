import { walletInfos } from "@/constants/wallet";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useFetchUserInfo } from "@/services/user";
import { useWalletStore } from "@/stores/walletStore";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Wallet } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import ConnectWalletModal from "./ConnectWalletModal";
import WalletDropdown from "./WalletDropdown";
import { RandomDelegationModal } from "./RandomDelegationModal";

interface Props {
  variant?: "short" | "long";
}

const WalletButton = ({ variant = "short" }: Props) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleOpen = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 250);
  };
  const { address, walletType, lucid, setWalletState } = useWalletStore();
  const { disconnect } = useConnectWallet();
  const [balance, setBalance] = useState(0);
  const userQuery = useFetchUserInfo();

  const stableUserData = useMemo(() => {
    const data = userQuery.data?.data as any;
    return {
      profilePicture: data?.profile?.data?.picture,
      profileName: data?.profile?.data?.name,
      adaHandle: data?.account?.[0]?.adahandle,
      livePool: data?.account?.[0]?.live_pool,
      drep: data?.account?.[0]?.drep,
      nftCount: data?.membership?.nfts || 0,
      hasAdmin:
        data?.power?.includes("pageAdmin") ||
        data?.power?.includes("articleAdmin"),
      hasMembership: (data?.membership?.nfts || 0) > 0,
    };
  }, [userQuery.data?.data]);

  const isLoading = userQuery.isLoading;

  const [openDelegationModal, setOpenDelegationModal] = useState(false);

  const handleCloseDropdown = useCallback(() => setShowDropdown(false), []);
  const handleSwitchWallet = useCallback(() => setShowWalletModal(true), []);

  const walletChannelRef = useRef<BroadcastChannel>();

  if (!walletChannelRef.current) {
    walletChannelRef.current = new BroadcastChannel("wallet_channel");
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
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

    walletChannelRef.current?.addEventListener("message", handleMessage, {
      signal,
    });

    return () => {
      controller.abort();
    };
  }, [disconnect]);

  useEffect(() => {
    if (address && walletType) {
      walletChannelRef.current?.postMessage({
        type: "WALLET_CONNECTED",
        payload: { address, walletType },
      });
    }
  }, [address, walletType]);

  useEffect(() => {
    const getBalance = async () => {
      if (!lucid || !address) return;

      try {
        const utxos = await lucid.wallet().getUtxos();
        const totalLovelace = utxos.reduce(
          (sum, utxo) => sum + utxo.assets.lovelace,
          0n,
        );
        setBalance(Number(totalLovelace));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(0);
      }
    };

    if (address && lucid) {
      getBalance();
    }
  }, [address, lucid]);

  return (
    <>
      {openDelegationModal && (
        <RandomDelegationModal onClose={() => setOpenDelegationModal(false)} />
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
        <div
          className='relative'
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <button
            className='box-border flex min-w-fit max-w-fit items-center justify-between rounded-[8px] border-2 border-secondaryText bg-secondaryBg px-2 py-1 text-text-sm font-medium text-secondaryText duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50'
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className='mr-1'>
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
          </button>

          <WalletDropdown
            isOpen={showDropdown}
            onClose={handleCloseDropdown}
            onSwitchWallet={handleSwitchWallet}
            address={address!}
            walletType={walletType!}
            balance={balance}
            userData={stableUserData}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
};

export default WalletButton;
