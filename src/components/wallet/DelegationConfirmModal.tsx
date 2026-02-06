import type { FC } from "react";
import { useState } from "react";
import {
  Modal,
  Button,
  SpinningLoader,
  formatString,
  formatNumberWithSuffix,
  cn,
} from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { DONATION_OPTIONS } from "@/constants/wallet";

export interface DelegationInfo {
  type: "pool" | "drep";
  ident: string;
  name?: string;
  ticker?: string;
  amount?: number;
}

interface DelegationConfirmModalProps {
  info: DelegationInfo;
  onConfirm: (donationAmount: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DelegationConfirmModal: FC<DelegationConfirmModalProps> = ({
  info,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useAppTranslation("common");
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const displayName =
    info.ticker && info.name
      ? `[${info.ticker}] ${info.name}`
      : info.name || formatString(info.ident, "short");

  const typeLabel = info.type === "pool" ? "Stake pool" : "DRep";

  const handleConfirm = () => {
    if (selectedDonation === null) return;
    onConfirm(selectedDonation);
  };

  if (isLoading) {
    return (
      <Modal minWidth='400px' maxWidth='95%' onClose={onCancel}>
        <div className='flex h-[300px] w-full items-center justify-center'>
          <SpinningLoader />
        </div>
      </Modal>
    );
  }

  return (
    <Modal maxWidth='min(560px, 90vw)' onClose={onCancel}>
      <div className='flex max-h-[80vh] flex-col overflow-y-auto p-4'>
        <h2 className='text-text-lg font-semibold'>
          {t("wallet.delegation.title", "Delegation")}
        </h2>
        <p className='mt-1 text-text-sm text-grayTextPrimary'>
          {t(
            "wallet.delegation.summary",
            "Summary of your delegation transaction:",
          )}
        </p>

        <div className='mt-4 space-y-3'>
          {info.amount !== undefined && (
            <div className='flex items-center justify-between border-b border-borderFaded pb-2'>
              <span className='text-text-sm text-grayTextPrimary'>
                {t("wallet.delegation.amount", "Amount")}
              </span>
              <span className='font-medium'>
                ₳ {formatNumberWithSuffix(info.amount / 1_000_000)}
              </span>
            </div>
          )}
          <div className='flex items-center justify-between border-b border-borderFaded pb-2'>
            <span className='text-text-sm text-grayTextPrimary'>
              {t("wallet.delegation.type", "Type")}
            </span>
            <span className='font-medium'>{typeLabel}</span>
          </div>
          <div className='flex items-start justify-between gap-4 border-b border-borderFaded pb-2'>
            <span className='shrink-0 text-text-sm text-grayTextPrimary'>
              {t("wallet.delegation.name", "Name")}
            </span>
            <span className='text-right font-medium text-primary'>
              {displayName}
            </span>
          </div>
          <div className='flex items-center justify-between border-b border-borderFaded pb-2'>
            <span className='text-text-sm text-grayTextPrimary'>
              {t("wallet.delegation.id", "ID")}
            </span>
            <span className='font-medium'>
              {formatString(info.ident, "short")}
            </span>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='font-medium'>
            {t("wallet.delegation.addDonation", "Add donation")}
          </h3>
          <p className='mt-1 text-text-sm text-grayTextPrimary'>
            {t(
              "wallet.delegation.donationDescription",
              "You can add a donation directly to your transaction to support development of Cexplorer.",
            )}
          </p>

          <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
            {DONATION_OPTIONS.map(option => {
              const Icon = option.icon;
              const isSelected = selectedDonation === option.value;
              const label = t(
                `wallet.delegation.${option.labelKey}`,
                option.labelKey,
              );

              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-m border p-2 transition-colors",
                    isSelected
                      ? "bg-primary/5 border-primary"
                      : "hover:border-primary/50 border-border",
                    option.value === 0 && "sm:col-span-2",
                  )}
                >
                  <input
                    type='radio'
                    name='donation'
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setSelectedDonation(option.value)}
                    className='h-4 w-4 accent-primary'
                  />
                  {Icon && <Icon size={18} className='text-primary' />}
                  <span className='text-text-sm'>
                    {option.value > 0 && (
                      <span className='font-medium'>₳{option.value}</span>
                    )}
                    {option.value > 0 ? " - " : ""}
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className='mt-6 flex items-center gap-3'>
          <Button
            label={t("common.cancel", "Cancel")}
            variant='secondary'
            size='md'
            onClick={onCancel}
          />
          <Button
            label={t("wallet.delegation.signTransaction", "Sign transaction")}
            variant='primary'
            size='md'
            onClick={handleConfirm}
            disabled={selectedDonation === null}
            className='flex-1'
          />
        </div>
      </div>
    </Modal>
  );
};
