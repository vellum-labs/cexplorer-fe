import { jamUrl } from "@/constants/confVariables";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { ShareButton } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { WatchlistStar } from "./WatchlistStar";
import type { useFetchPoolDetail } from "@/services/pools";
import type { useFetchDrepDetail } from "@/services/drep";
import { useWalletStore } from "@/stores/walletStore";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const WatchlistSection = ({
  ident,
  isLoading,
  collection,
  ticker,
  poolDetailQuery,
  drepDetailQuery,
  enableWatchlistModal = false,
  stakeKey,
  hasDex = false,
  assetName,
  isPoolRetiredOrRetiring = false,
}: {
  ident: string | undefined;
  isLoading: boolean;
  collection?: string | null;
  ticker?: string;
  poolDetailQuery?: ReturnType<typeof useFetchPoolDetail>;
  drepDetailQuery?: ReturnType<typeof useFetchDrepDetail>;
  enableWatchlistModal?: boolean;
  stakeKey?: string;
  hasDex?: boolean;
  assetName?: string;
  isPoolRetiredOrRetiring?: boolean;
}) => {
  const { wallet, address, walletType } = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const { t } = useAppTranslation();

  const drepName = drepDetailQuery?.data?.data?.given_name;
  const isPool = !!poolDetailQuery;
  const isDrep = !!drepDetailQuery;

  const handleDelegateClick = () => {
    if (!address && !walletType) {
      setShowWalletModal(true);
      return;
    }

    handleDelegation(
      { type: isPool ? "pool" : "drep", ident: ident ?? "" },
      wallet,
    );
  };

  const getDelegateLabel = () => {
    if (isPool) {
      return !ticker
        ? t("global.watchlist.delegate")
        : t("global.watchlist.delegateTo", { ticker });
    }

    if (!isDrep) return "";

    if (!drepName || drepName.length > 20) {
      return t("global.watchlist.delegateToThisDrep");
    }

    return t("global.watchlist.delegateToDrep", { name: drepName });
  };

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
        {hasDex && (
          <LoadingSkeleton
            height='32px'
            width='70px'
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
          label={t("global.watchlist.marketplace")}
          className='h-[32px]'
        />
      )}
      {hasDex && assetName && (
        <Button
          href={`/swap?asset=${assetName}` as any}
          size='md'
          leftIcon={<ShoppingBasket size={18} />}
          variant='primary'
          label={t("global.watchlist.buy")}
        />
      )}
      {!isPoolRetiredOrRetiring && <ShareButton />}
      {!isPoolRetiredOrRetiring && (
        <WatchlistStar
          ident={ident}
          showOptionsModal={enableWatchlistModal}
          stakeKey={stakeKey}
        />
      )}
      {!isPoolRetiredOrRetiring && (
        <Button
          label={t("global.watchlist.promote")}
          variant='tertiary'
          size='md'
          href='/pro'
        />
      )}
      {(isPool || isDrep) && !isPoolRetiredOrRetiring && (
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
