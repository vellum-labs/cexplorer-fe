import { jamUrl } from "@/constants/confVariables";
import { ShoppingBasket } from "lucide-react";
import Button from "../Button";
import { ShareButton } from "../ShareButton";
import LoadingSkeleton from "../skeletons/LoadingSkeleton";
import { WatchlistStar } from "./WatchlistStar";
import type { useFetchPoolDetail } from "@/services/pools";
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
  enableWatchlistModal = false,
  stakeKey,
}: {
  ident: string | undefined;
  isLoading: boolean;
  collection?: string | null;
  ticker?: string;
  poolDetailQuery?: ReturnType<typeof useFetchPoolDetail>;
  enableWatchlistModal?: boolean;
  stakeKey?: string;
}) => {
  const { lucid, address, walletType } = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  if (isLoading)
    return (
      <section className='ml-auto flex w-full max-w-desktop items-center justify-end gap-1'>
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
    <div className='ml-auto flex w-full items-center justify-end gap-1'>
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
      {poolDetailQuery && (
        <Button
          label={!ticker ? "Delegate" : `Delegate to [${ticker}]`}
          variant='primary'
          size='md'
          onClick={() =>
            !address && !walletType
              ? setShowWalletModal(true)
              : handleDelegation(ident ?? "", lucid)
          }
        />
      )}
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};
