import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { colors } from "@/constants/colors";
import { useAuthToken } from "@/hooks/useAuthToken";
import { fetchWatchlist } from "@/services/user";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";

interface Props {
  ident: string | undefined;
  listView?: boolean;
  onClick?: () => void;
}

export const WatchlistStar = ({ ident, listView, onClick }: Props) => {
  const { watchlist, setWatchlist } = useWatchlistStore();
  const token = useAuthToken();
  const [isLiked, setIsLiked] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    setIsLiked(!!watchlist?.some(item => item.ident === ident));
  }, [watchlist, ident]);

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
    } else {
      setIsLiked(!isLiked);
      const data = await fetchWatchlist({
        token,
        add: ident,
      });
      setWatchlist(data?.data?.data);
    }
  };

  const handleUnlike = async () => {
    if (!token) return;

    setIsLiked(false);
    setShowRemoveModal(false);

    const data = await fetchWatchlist({
      token,
      remove: ident,
    });

    setWatchlist(data?.data?.data);
  };

  return (
    <>
      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
      {showRemoveModal && (
        <Modal onClose={() => setShowRemoveModal(false)}>
          <p className='mt-8 text-sm'>
            Do you wish to remove this item from your watchlist?
          </p>
          <div className='mt-6 flex w-full justify-between'>
            <Button
              onClick={() => setShowRemoveModal(false)}
              className='mr-2'
              variant='secondary'
              label='Cancel'
              size='md'
            />
            <Button
              onClick={handleUnlike}
              className='mr-2'
              variant='primary'
              label='Remove'
              size='md'
            />
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
        <Button
          leftIcon={
            <Star
              strokeWidth={2}
              stroke={colors.primary}
              fill={isLiked ? colors.primary : "none"}
              size={17}
              onClick={handleClick}
              className='cursor-pointer'
            />
          }
          size='xs'
          variant='tertiary'
          onClick={handleClick}
          className='h-8 px-2'
        />
      )}
    </>
  );
};
