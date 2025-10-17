import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { colors } from "@/constants/colors";
import { useAuthToken } from "@/hooks/useAuthToken";
import { fetchWatchlist, fetchAccountList } from "@/services/user";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import Modal from "../Modal";

interface Props {
  ident: string | undefined;
  listView?: boolean;
  onClick?: () => void;
  showOptionsModal?: boolean;
  stakeKey?: string;
}

export const WatchlistStar = ({
  ident,
  listView,
  onClick,
  showOptionsModal: enableOptionsModal = false,
  stakeKey,
}: Props) => {
  const { watchlist, setWatchlist } = useWatchlistStore();
  const token = useAuthToken();
  const [isLiked, setIsLiked] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isStakeKeyInWatchlist, setIsStakeKeyInWatchlist] = useState(false);

  useEffect(() => {
    setIsLiked(!!watchlist?.some(item => item.ident === ident));
  }, [watchlist, ident]);

  useEffect(() => {
    if (!token || !stakeKey) return;

    const checkStakeKeyInWatchlist = async () => {
      try {
        const data = await fetchAccountList({ token });

        const isInWatchlist = data?.data?.data?.some(
          item => item.view === stakeKey,
        );
        setIsStakeKeyInWatchlist(!!isInWatchlist);
      } catch (error) {
        console.error("Error checking stake key in watchlist:", error);
      }
    };

    checkStakeKeyInWatchlist();
  }, [token, stakeKey]);

  const handleClick = async () => {
    if (!token) {
      setShowConnectModal(true);
      return;
    }

    if (onClick) {
      onClick();
      return;
    }

    if (isLiked) {
      setShowRemoveModal(true);
    } else if (enableOptionsModal) {
      setShowOptionsModal(true);
      return;
    } else {
      setIsLiked(!isLiked);
      try {
        const data = await fetchWatchlist({
          token,
          add: ident,
        });
        setWatchlist(data?.data?.data);
      } catch (error) {
        console.error("Error adding to watchlist:", error);
        setIsLiked(isLiked);
      }
    }
  };

  const handleUnlike = async () => {
    if (!token) return;

    setIsLiked(false);
    setShowRemoveModal(false);

    try {
      const data = await fetchWatchlist({
        token,
        remove: ident,
      });

      setWatchlist(data?.data?.data);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setIsLiked(true);
    }
  };

  const handleAddStakeKey = async () => {
    if (!token || !stakeKey) return;

    setShowOptionsModal(false);

    try {
      const data = await fetchWatchlist({
        token,
        add: stakeKey,
      });

      setWatchlist(data?.data?.data);
      setIsStakeKeyInWatchlist(true);
    } catch (error) {
      console.error("Error adding stake key to watchlist:", error);
      setShowOptionsModal(true);
    }
  };

  const handleAddAddress = async () => {
    if (!token || !ident) return;

    setShowOptionsModal(false);

    try {
      const data = await fetchWatchlist({
        token,
        add: ident,
      });

      setWatchlist(data?.data?.data);
    } catch (error) {
      console.error("Error adding address to watchlist:", error);
      setShowOptionsModal(true);
    }
  };

  const handleRemoveStakeKey = async () => {
    if (!token || !stakeKey) return;

    setShowOptionsModal(false);

    try {
      const data = await fetchWatchlist({
        token,
        remove: stakeKey,
      });

      setWatchlist(data?.data?.data);
      setIsStakeKeyInWatchlist(false);
    } catch (error) {
      console.error("Error removing stake key from watchlist:", error);
      setShowOptionsModal(true);
    }
  };

  return (
    <>
      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
      {showRemoveModal && (
        <Modal onClose={() => setShowRemoveModal(false)}>
          <p className='mt-4 text-text-sm'>
            Do you wish to remove this item from your watchlist?
          </p>
          <div className='mt-3 flex w-full justify-between'>
            <Button
              onClick={() => setShowRemoveModal(false)}
              className='mr-1'
              variant='secondary'
              label='Cancel'
              size='md'
            />
            <Button
              onClick={handleUnlike}
              className='mr-1'
              variant='primary'
              label='Remove'
              size='md'
            />
          </div>
        </Modal>
      )}
      {showOptionsModal && (
        <Modal onClose={() => setShowOptionsModal(false)}>
          <div className='text-center'>
            <h3 className='mb-2 text-text-lg font-semibold'>
              {isStakeKeyInWatchlist ? "Manage Watchlist" : "Add to Watchlist"}
            </h3>
            <p className='mb-3 text-text-sm text-grayTextPrimary'>
              {isStakeKeyInWatchlist
                ? "Choose an action for your watchlist:"
                : "Choose what to add to your watchlist:"}
            </p>
            <div className='flex w-full flex-col items-center gap-1.5'>
              <Button
                onClick={
                  isStakeKeyInWatchlist ? handleAddAddress : handleAddStakeKey
                }
                variant='primary'
                label={isStakeKeyInWatchlist ? "Add Address" : "Add Stake Key"}
                size='lg'
                className='w-full'
              />
              <Button
                onClick={
                  isStakeKeyInWatchlist
                    ? handleRemoveStakeKey
                    : handleAddAddress
                }
                variant='secondary'
                label={
                  isStakeKeyInWatchlist ? "Remove Stake Key" : "Add Address"
                }
                size='md'
                className='w-full'
              />
            </div>
          </div>
        </Modal>
      )}
      {listView ? (
        <button className='flex h-full items-center' onClick={handleClick}>
          <Star
            strokeWidth={2}
            stroke={colors.primary}
            fill={isLiked ? colors.primary : "none"}
            size={20}
            onClick={handleClick}
            className='cursor-pointer'
          />
        </button>
      ) : (
        <button
          onClick={handleClick}
          className='flex h-10 w-10 items-center justify-center rounded-s border border-border bg-transparent hover:bg-darker'
        >
          <Star
            strokeWidth={2}
            stroke={colors.primary}
            fill={isLiked ? colors.primary : "none"}
            size={17}
            className='cursor-pointer'
          />
        </button>
      )}
    </>
  );
};
