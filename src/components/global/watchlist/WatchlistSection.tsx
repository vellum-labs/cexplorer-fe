import { jamUrl } from "@/constants/confVariables";
import { ShoppingBasket } from "lucide-react";
import Button from "../Button";
import { ShareButton } from "../ShareButton";
import LoadingSkeleton from "../skeletons/LoadingSkeleton";
import { WatchlistStar } from "./WatchlistStar";
import type { useFetchPoolDetail } from "@/services/pools";
import type { useFetchDrepDetail } from "@/services/drep";
import { useWalletStore } from "@/stores/walletStore";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { useState } from "react";

export const WatchlistSection = ({
  ident,
  isLoading,
  collection,
  ticker,
  poolDetailQuery,
  drepDetailQuery,
  enableWatchlistModal = false,
  stakeKey,
}: {
  ident: string | undefined;
  isLoading: boolean;
  collection?: string | null;
  ticker?: string;
  poolDetailQuery?: ReturnType<typeof useFetchPoolDetail>;
  drepDetailQuery?: ReturnType<typeof useFetchDrepDetail>;
  enableWatchlistModal?: boolean;
  stakeKey?: string;
}) => {
  const { lucid, address, walletType } = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  const drepName = drepDetailQuery?.data?.data?.given_name;
  const isPool = !!poolDetailQuery;
  const isDrep = !!drepDetailQuery;

  const handleDelegateClick = () => {
    if (!address && !walletType) {
      setShowWalletModal(true);
      return;
    }

    if (isPool) {
      handleDelegation({ type: "pool", poolId: ident ?? "" }, lucid);
    } else if (isDrep) {
      handleDelegation({ type: "drep", drepId: ident ?? "" }, lucid);
    }
  };

  const getDelegateLabel = () => {
    if (isPool) {
      return !ticker ? "Delegate" : `Delegate to [${ticker}]`;
    }

    if (isDrep) {
      if (!drepName) return "Delegate to this DRep";
      return drepName.length > 20
        ? "Delegate to this DRep"
        : `Delegate to ${drepName}`;
    }

    return "";
  };

  if (isLoading)
    return (
      <section className='ml-auto flex w-full max-w-desktop items-center justify-end gap-2'>
        {collection && (
          <LoadingSkeleton
            height='32px'
            width='117px'
            rounded='lg'
            className='h-8'
          />
        )}
        <LoadingSkeleton
          height='32px'
          width='32px'
          rounded='lg'
          className='h-8'
        />
        <LoadingSkeleton
          height='32px'
          width='32px'
          rounded='lg'
          className='h-8'
        />
      </section>
    );

  return (
    <div className='ml-auto flex w-full items-center justify-end gap-2'>
      {collection && (
        <Button
          href={`${jamUrl}collections/${collection}` as any}
          targetBlank
          size='sm'
          leftIcon={<ShoppingBasket size={18} />}
          variant='primary'
          label='Marketplace'
          className='h-[32px]'
        />
      )}
      <ShareButton />
      <WatchlistStar ident={ident} showOptionsModal={enableWatchlistModal} stakeKey={stakeKey} />
      <Button label='Promote' variant='tertiary' size='md' href='/pro' />
      {(isPool || isDrep) && (
        <Button
          label={getDelegateLabel()}
          variant='primary'
          size='md'
          onClick={handleDelegateClick}
        />
      )}
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};
