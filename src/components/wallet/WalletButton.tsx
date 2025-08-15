import { walletInfos } from "@/constants/wallet";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useFetchUserInfo } from "@/services/user";
import { useWalletStore } from "@/stores/walletStore";
import { formatString } from "@/utils/format/format";
import { getWalletBalance } from "@/utils/wallet/getWalletBalance";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../global/Button";
import ConnectWalletModal from "./ConnectWalletModal";
import DelegationModal from "./DelegationModal";
import WalletDropdown from "./WalletDropdown";

interface Props {
  variant?: "short" | "long";
}

const WalletButton = ({ variant = "short" }: Props) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  let timeout: NodeJS.Timeout;

  const handleOpen = () => {
    clearTimeout(timeout);
    setShowDropdown(true);
  };

  const handleClose = () => {
    timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 250);
  };
  const { address, walletType, walletApi, setWalletState } = useWalletStore();
  const { disconnect } = useConnectWallet();
  const [balance, setBalance] = useState(0);
  const userQuery = useFetchUserInfo();
  const [openDelegationModal, setOpenDelegationModal] = useState(false);

  const walletChannel = new BroadcastChannel("wallet_channel");

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
        <div
          className='relative'
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <button
            className='box-border flex min-w-fit max-w-fit items-center justify-between rounded-[8px] border-2 border-secondaryText bg-secondaryBg px-4 py-2 text-sm font-medium text-secondaryText duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50'
            onClick={() => setShowDropdown(!showDropdown)}
          >
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
          </button>

          {showDropdown && (
            <WalletDropdown
              isOpen={showDropdown}
              onClose={() => setShowDropdown(false)}
              onSwitchWallet={() => setShowWalletModal(true)}
              address={address!}
              walletType={walletType!}
              balance={balance}
              userQuery={userQuery}
            />
          )}
        </div>
      )}
    </>
  );
};

export default WalletButton;
