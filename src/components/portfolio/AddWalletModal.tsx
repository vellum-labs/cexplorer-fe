import type { FC } from "react";
import { useState } from "react";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { fetchAddressDetail } from "@/services/address";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  Modal,
  Button,
  TextInput,
  formatString,
} from "@vellumlabs/cexplorer-sdk";

interface AddWalletModalProps {
  onClose: () => void;
}

export const AddWalletModal: FC<AddWalletModalProps> = ({ onClose }) => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { wallets, addWallet } = usePortfolioStore();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [resolvedStake, setResolvedStake] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setResolvedStake("");

    if (!name.trim()) {
      setError(t("portfolio.addWallet.nameRequired"));
      return;
    }

    if (!address.trim()) {
      setError(t("portfolio.addWallet.addressRequired"));
      return;
    }

    if (wallets.length >= 10) {
      setError(t("portfolio.addWallet.maxWallets"));
      return;
    }

    const trimmed = address.trim();

    if (!trimmed.startsWith("stake") && !trimmed.startsWith("addr")) {
      setError(t("portfolio.addWallet.invalidAddress"));
      return;
    }

    setIsSubmitting(true);

    try {
      let stakeAddress = trimmed;

      if (trimmed.startsWith("addr")) {
        const { data } = await fetchAddressDetail({ view: trimmed });
        const stakeView = data?.data?.[0]?.stake?.view;

        if (!stakeView) {
          setError(t("portfolio.addWallet.noStakeKey"));
          setIsSubmitting(false);
          return;
        }

        stakeAddress = stakeView;
        setResolvedStake(stakeAddress);
      }

      const isDuplicate = wallets.some(
        w => w.stakeAddress === stakeAddress,
      );
      if (isDuplicate) {
        setError(t("portfolio.addWallet.duplicateAddress"));
        setIsSubmitting(false);
        return;
      }

      addWallet({
        name: name.trim(),
        stakeAddress,
        originalAddress: trimmed,
      });

      onClose();
    } catch {
      setError(t("portfolio.addWallet.fetchError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal minHeight='340px' minWidth='400px' maxWidth='95%' onClose={onClose}>
      <p className='mb-1 pr-4 text-text-lg font-medium'>
        {t("portfolio.addWallet.title")}
      </p>
      <p className='mb-2 text-text-sm text-grayTextPrimary'>
        {t("portfolio.addWallet.subtitle")}
      </p>

      <TextInput
        placeholder={t("portfolio.addWallet.namePlaceholder")}
        onchange={value => setName(value)}
        value={name}
        wrapperClassName='mb-1'
      />

      <TextInput
        placeholder={t("portfolio.addWallet.addressPlaceholder")}
        onchange={value => {
          setAddress(value);
          setResolvedStake("");
          setError("");
        }}
        value={address}
        wrapperClassName='mb-0.5'
      />

      <p className='mb-1 min-h-3 text-text-xs'>
        {resolvedStake && (
          <span className='text-primary'>
            {t("portfolio.addWallet.resolvedTo")}{" "}
            {formatString(resolvedStake, "long")}
          </span>
        )}
        {error && <span className='text-redText'>{error}</span>}
      </p>

      <div className='mt-auto flex justify-end gap-1'>
        <Button
          onClick={onClose}
          variant='secondary'
          size='md'
          label={t("common:actions.cancel")}
        />
        <Button
          onClick={handleSubmit}
          variant='primary'
          size='md'
          label={
            isSubmitting
              ? t("portfolio.addWallet.adding")
              : t("portfolio.addWallet.add")
          }
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
};
