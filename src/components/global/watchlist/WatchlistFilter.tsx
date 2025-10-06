import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { colors } from "@/constants/colors";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { Switch } from "../Switch";

interface Props {
  watchlistOnly: boolean;
  setWatchlistOnly: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WatchlistFilter = ({ watchlistOnly, setWatchlistOnly }: Props) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const token = useAuthToken();

  const handleClick = e => {
    if (!token) {
      setShowWalletModal(true);
      e.preventDefault();
    }
  };

  return (
    <>
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      <div
        className='flex h-10 min-w-fit items-center gap-1/2 rounded-lg border border-border px-1 font-medium'
        onClick={e => handleClick(e)}
      >
        <Switch
          active={watchlistOnly}
          onClick={() => setWatchlistOnly(!watchlistOnly)}
        />
        <Star stroke={colors.grayTextPrimary} size={18} />
      </div>
    </>
  );
};
