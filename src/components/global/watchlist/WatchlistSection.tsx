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
import {
  DelegationConfirmModal,
  type DelegationInfo,
} from "@/components/wallet/DelegationConfirmModal";
import { useState, useEffect } from "react";
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
  externalDelegationModalOpen = false,
  onExternalDelegationModalClose,
  showPromote = true,
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
  externalDelegationModalOpen?: boolean;
  onExternalDelegationModalClose?: () => void;
  showPromote?: boolean;
}) => {
  const { wallet, address, walletType } = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showDelegationModal, setShowDelegationModal] =
    useState<boolean>(false);
  const [delegationLoading, setDelegationLoading] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (externalDelegationModalOpen) {
      setShowDelegationModal(true);
      onExternalDelegationModalClose?.();
    }
  }, [externalDelegationModalOpen, onExternalDelegationModalClose]);

  const drepName = drepDetailQuery?.data?.data?.given_name;
  const poolData = poolDetailQuery?.data?.data;
  const isPool = !!poolDetailQuery;
  const isDrep = !!drepDetailQuery;

  useEffect(() => {
    const getBalance = async () => {
      if (!wallet || !address) return;
      try {
        const utxos = await wallet.getUtxos();
        const totalLovelace = utxos.reduce((sum, utxo) => {
          const lovelaceAsset = utxo.output.amount.find(
            a => a.unit === "lovelace",
          );
          return sum + BigInt(lovelaceAsset?.quantity || "0");
        }, 0n);
        if (totalLovelace > BigInt(Number.MAX_SAFE_INTEGER)) {
          setWalletBalance(Number.MAX_SAFE_INTEGER);
        } else {
          setWalletBalance(Number(totalLovelace));
        }
      } catch {
        setWalletBalance(0);
      }
    };
    if (address && wallet) {
      getBalance();
    }
  }, [address, wallet]);

  const handleDelegateClick = () => {
    if (!wallet || !address || !walletType) {
      setShowWalletModal(true);
      return;
    }
    setShowDelegationModal(true);
  };

  const handleDelegationConfirm = async (donationAmount: number) => {
    setDelegationLoading(true);
    try {
      await handleDelegation(
        {
          type: isPool ? "pool" : "drep",
          ident: ident ?? "",
          donationAmount,
        },
        wallet,
      );
    } finally {
      setDelegationLoading(false);
      setShowDelegationModal(false);
    }
  };

  const getDelegationInfo = (): DelegationInfo => {
    if (isPool) {
      return {
        type: "pool",
        ident: ident ?? "",
        name: poolData?.pool_name?.name,
        ticker: poolData?.pool_name?.ticker,
        amount: walletBalance,
      };
    }
    return {
      type: "drep",
      ident: ident ?? "",
      name: drepName,
      amount: walletBalance,
    };
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
      {showPromote && !isPoolRetiredOrRetiring && (
        <Button
          label={t("global.watchlist.promote")}
          variant='tertiary'
          size='md'
          href='/pro'
          className='h-10'
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
      {showDelegationModal && (
        <DelegationConfirmModal
          info={getDelegationInfo()}
          onConfirm={handleDelegationConfirm}
          onCancel={() => {
            setShowDelegationModal(false);
            onExternalDelegationModalClose?.();
          }}
          isLoading={delegationLoading}
        />
      )}
    </div>
  );
};
