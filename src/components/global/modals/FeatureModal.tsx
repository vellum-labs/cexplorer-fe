import type { Dispatch, FC, SetStateAction } from "react";

import Modal from "../Modal";

import { useEffect, useState } from "react";
import { useWalletStore } from "@/stores/walletStore";
import { ArrowRight, WalletMinimal } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface FeatureModalProps {
  onClose: () => void;
  subTitle?: string;
  setShowConnectWallet: Dispatch<SetStateAction<boolean>>;
}

export const FeatureModal: FC<FeatureModalProps> = ({
  onClose,
  subTitle = "To access premium features, you need to own a Cexplorer NFT. Connect your wallet or buy the NFT now.",
  setShowConnectWallet,
}) => {
  const [isWalletConnected, setWalletConected] = useState<boolean>(false);

  const { address, walletApi } = useWalletStore();

  const handleCancel = () => {
    if (!isWalletConnected) {
      setShowConnectWallet(true);
    }

    onClose();
  };

  useEffect(() => {
    setWalletConected(!!address && !!walletApi);
  }, [address, walletApi]);

  return (
    <Modal minWidth='95%' maxWidth='400px' maxHeight='95%' onClose={onClose}>
      <div className='flex h-full w-full flex-col gap-3'>
        <span className='text-lg font-semibold'>
          Cexplorer <span className='font-bold text-[#3c53ed]'>PRO</span>{" "}
          feature
        </span>
        <p className='max-w-[320px] text-sm'>{subTitle}</p>
        <div className='flex items-center justify-between gap-1.5'>
          <button
            className='flex h-[40px] w-full max-w-[170px] flex-1 cursor-pointer items-center justify-center rounded-md border border-border'
            onClick={handleCancel}
          >
            {isWalletConnected ? (
              <span className='text-base font-semibold'>Cancel</span>
            ) : (
              <div className='flex items-center gap-1'>
                <WalletMinimal size={15} />
                <span className='text-base font-semibold'>Connect wallet</span>
              </div>
            )}
          </button>
          <button
            className='flex h-[40px] w-full max-w-[170px] flex-1 cursor-pointer items-center justify-center gap-1 rounded-md'
            style={{
              background: "linear-gradient(270deg, #6A11CB 0%, #2575FC 100%)",
            }}
          >
            <Link to='/pro'>
              <span className='text-base font-semibold text-white'>
                Get a PRO
              </span>
            </Link>
            <ArrowRight color='white' size={15} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
