import type { FC } from "react";
import { useState } from "react";
import {
  Modal,
  Button,
  Image,
  formatString,
  cn,
} from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useWalletStore } from "@/stores/walletStore";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { PoolSelector } from "@/components/staking-calculator/PoolSelector";
import { DRepSelector, type DRep } from "./DRepSelector";
import { GlobalSearchProvider } from "@vellumlabs/cexplorer-sdk";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscSearch } from "@/services/misc";
import { AlertTriangle } from "lucide-react";

interface PreDelegationModalProps {
  portfolioStakeAddress: string | undefined;
  portfolioAddress: string | undefined;
  delegationType: "pool" | "drep";
  currentIdent: string;
  onContinue: (ident: string) => void;
  onCancel: () => void;
}

export const PreDelegationModal: FC<PreDelegationModalProps> = ({
  portfolioStakeAddress,
  portfolioAddress,
  delegationType,
  currentIdent,
  onContinue,
  onCancel,
}) => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { stakeKey, address } = useWalletStore();
  const { locale } = useLocaleStore();

  const isPool = delegationType === "pool";
  const hasCurrentIdent = !!currentIdent;

  const [poolSelection, setPoolSelection] = useState<"default" | "custom">(
    hasCurrentIdent ? "default" : "custom",
  );
  const [customPool, setCustomPool] = useState<{
    pool_id: string;
    pool_name: { ticker: string; name: string };
  } | null>(null);
  const [customDRep, setCustomDRep] = useState<DRep | null>(null);
  const [continueAnyway, setContinueAnyway] = useState(false);

  const stakeMatch =
    portfolioStakeAddress && stakeKey && portfolioStakeAddress === stakeKey;
  const addressMatch =
    portfolioAddress && address && portfolioAddress === address;
  const walletMismatch =
    (portfolioStakeAddress || portfolioAddress) &&
    (stakeKey || address) &&
    !stakeMatch &&
    !addressMatch;

  const selectedIdent = poolSelection === "default"
    ? currentIdent
    : isPool
      ? customPool?.pool_id ?? ""
      : customDRep?.drep_id ?? "";

  const canContinue =
    (!walletMismatch || continueAnyway) && !!selectedIdent;

  return (
    <Modal maxWidth='min(560px, 90vw)' onClose={onCancel}>
      <div className='mt-4 flex max-h-[80vh] flex-col overflow-y-auto'>
        <h2 className='text-text-lg font-semibold'>
          {t("common:wallet.delegation.title")}
        </h2>
        <p className='mt-1 text-text-sm text-grayTextPrimary'>
          {t("portfolio.preDelegation.subtitle")}
        </p>

        <div className='mt-4 flex items-center justify-between border-b border-borderFaded pb-3'>
          <span className='text-text-sm text-grayTextPrimary'>
            {t("portfolio.preDelegation.connectedWallet")}
          </span>
          <span className='text-text-sm font-medium text-primary'>
            {stakeKey ? formatString(stakeKey, "short") : "-"}
          </span>
        </div>

        {walletMismatch && (
          <div className='mt-3 rounded-m border border-yellowText/30 bg-yellowText/5 p-3'>
            <div className='flex items-start gap-2'>
              <AlertTriangle
                size={16}
                className='mt-0.5 shrink-0 text-yellowText'
              />
              <p className='text-text-sm text-yellowText'>
                {(() => {
                  const addr = portfolioStakeAddress || portfolioAddress || "";
                  const short = addr.length > 13 ? `${addr.slice(0, 8)}...${addr.slice(-5)}` : addr;
                  return t("portfolio.preDelegation.walletMismatch", { address: short });
                })()}
              </p>
            </div>
            <label className='mt-2 flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                checked={continueAnyway}
                onChange={e => setContinueAnyway(e.target.checked)}
                className='h-4 w-4 accent-primary'
              />
              <span className='text-text-sm text-yellowText'>
                {t("portfolio.preDelegation.useAnyway")}
              </span>
            </label>
          </div>
        )}

        {isPool && (
          <div className='mt-4'>
            <h3 className='font-medium'>
              {t("portfolio.preDelegation.selectPool")}
            </h3>
            <p className='mt-1 text-text-sm text-grayTextPrimary'>
              {t("portfolio.preDelegation.selectPoolDescription")}
            </p>

            <div className='mt-3 flex flex-col gap-2'>
              {hasCurrentIdent && (
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-m border p-3 transition-colors",
                    poolSelection === "default"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <input
                    type='radio'
                    name='poolSelection'
                    checked={poolSelection === "default"}
                    onChange={() => setPoolSelection("default")}
                    className='h-4 w-4 accent-primary'
                  />
                  <Image
                    src={generateImageUrl(currentIdent, "ico", "pool")}
                    type='pool'
                    height={32}
                    width={32}
                    className='shrink-0 rounded-max'
                  />
                  <div className='min-w-0'>
                    <p className='text-text-sm font-medium truncate'>
                      {formatString(currentIdent, "short")}
                    </p>
                    <p className='text-text-xs text-grayTextPrimary'>
                      {t("portfolio.preDelegation.currentDelegation")}
                    </p>
                  </div>
                </label>
              )}

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-m border p-3 transition-colors",
                  poolSelection === "custom"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <input
                  type='radio'
                  name='poolSelection'
                  checked={poolSelection === "custom"}
                  onChange={() => setPoolSelection("custom")}
                  className='mt-1 h-4 w-4 accent-primary'
                />
                <div className='min-w-0 flex-1'>
                  <GlobalSearchProvider
                    useFetchMiscSearch={useFetchMiscSearch}
                    locale={locale}
                    generateImageUrl={generateImageUrl}
                  >
                    <PoolSelector
                      selectedPool={customPool}
                      onSelectPool={pool => {
                        setCustomPool(pool);
                        setPoolSelection("custom");
                      }}
                    />
                  </GlobalSearchProvider>
                </div>
              </label>
            </div>
          </div>
        )}

        {!isPool && (
          <div className='mt-4'>
            <h3 className='font-medium'>
              {t("portfolio.preDelegation.selectDRep")}
            </h3>

            <div className='mt-3 flex flex-col gap-2'>
              {hasCurrentIdent && (
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-m border p-3 transition-colors",
                    poolSelection === "default"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <input
                    type='radio'
                    name='poolSelection'
                    checked={poolSelection === "default"}
                    onChange={() => setPoolSelection("default")}
                    className='h-4 w-4 accent-primary'
                  />
                  <Image
                    src={generateImageUrl(currentIdent, "ico", "drep")}
                    type='user'
                    height={32}
                    width={32}
                    className='shrink-0 rounded-max'
                  />
                  <div className='min-w-0'>
                    <p className='text-text-sm font-medium truncate'>
                      {formatString(currentIdent, "short")}
                    </p>
                    <p className='text-text-xs text-grayTextPrimary'>
                      {t("portfolio.preDelegation.currentDrepDelegation")}
                    </p>
                  </div>
                </label>
              )}

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-m border p-3 transition-colors",
                  poolSelection === "custom"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <input
                  type='radio'
                  name='poolSelection'
                  checked={poolSelection === "custom"}
                  onChange={() => setPoolSelection("custom")}
                  className='mt-1 h-4 w-4 accent-primary'
                />
                <div className='min-w-0 flex-1'>
                  <GlobalSearchProvider
                    useFetchMiscSearch={useFetchMiscSearch}
                    locale={locale}
                    generateImageUrl={generateImageUrl}
                  >
                    <DRepSelector
                      selectedDRep={customDRep}
                      onSelectDRep={drep => {
                        setCustomDRep(drep);
                        setPoolSelection("custom");
                      }}
                    />
                  </GlobalSearchProvider>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className='mt-6 flex items-center gap-3'>
          <Button
            label={t("common:actions.cancel")}
            variant='secondary'
            size='md'
            onClick={onCancel}
          />
          <Button
            label={t("portfolio.preDelegation.continue")}
            variant='primary'
            size='md'
            onClick={() => onContinue(selectedIdent)}
            disabled={!canContinue}
            className='flex-1'
          />
        </div>
      </div>
    </Modal>
  );
};
