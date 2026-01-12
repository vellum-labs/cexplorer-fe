import type { FC } from "react";
import { useState } from "react";
import type { BrowserWallet } from "@meshsdk/core";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { RangeSlider } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Wallet } from "lucide-react";
import { handleDonation } from "@/utils/treasury/handleDonation";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface TreasuryDonationModalProps {
  onClose: () => void;
  onSuccess: (hash: string) => void;
  wallet: BrowserWallet | null;
}

export const TreasuryDonationModal: FC<TreasuryDonationModalProps> = ({
  onClose,
  onSuccess,
  wallet,
}) => {
  const { t } = useAppTranslation("common");
  const [amount, setAmount] = useState<string>("");
  const [cexplorerPercentage, setCexplorerPercentage] = useState<number>(10);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setAmount(value);
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
  };

  const calculateSplit = () => {
    const totalAda = Number(amount) || 0;
    const cexplorerAda = (totalAda * cexplorerPercentage) / 100;
    const treasuryAda = totalAda - cexplorerAda;
    return { treasuryAda, cexplorerAda };
  };

  const handleDonationClick = () => {
    handleDonation({
      wallet,
      amount,
      cexplorerPercentage,
      comment,
      setIsSubmitting,
      onSuccess,
    });
  };

  const { treasuryAda, cexplorerAda } = calculateSplit();
  const isValidAmount = amount && Number(amount) > 0;

  return (
    <Modal minWidth='450px' maxWidth='95%' maxHeight='90vh' onClose={onClose}>
      <div className='flex w-full flex-col gap-4 p-2'>
        <h2>{t("treasury.modal.title")}</h2>
        <p className='text-text-sm text-grayTextPrimary'>
          {t("treasury.modal.description")}
        </p>

        <div className='flex flex-col gap-1'>
          <label className='text-text-sm font-medium'>
            {t("treasury.modal.amountLabel")} <span className='text-redText'>*</span>
          </label>
          <TextInput
            inputClassName='h-10'
            wrapperClassName='w-full'
            value={amount}
            onchange={handleAmountChange}
            placeholder={t("treasury.modal.amountPlaceholder")}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-text-sm font-medium'>{t("treasury.modal.commentLabel")}</label>
          <textarea
            className='h-20 w-full rounded-m border border-border bg-background px-2 py-1.5 text-text-sm outline-none focus:border-primary'
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={t("treasury.modal.commentPlaceholder")}
            maxLength={500}
          />
          <p className='text-text-xs text-grayTextPrimary'>
            {t("treasury.modal.charactersCount", { count: comment.length })}
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-text-sm font-medium'>
            {t("treasury.modal.cexplorerSupport", { percentage: cexplorerPercentage })}
          </label>
          <RangeSlider
            min={0}
            max={100}
            step={1}
            value={cexplorerPercentage}
            onChange={setCexplorerPercentage}
          />
          <p className='text-text-xs text-grayTextPrimary'>
            {t("treasury.modal.sliderDescription")}
          </p>
        </div>

        {isValidAmount && (
          <div className='rounded-m border border-border bg-cardBg p-1.5'>
            <p className='mb-1 text-text-sm font-medium'>{t("treasury.modal.donationSplit")}</p>
            <div className='flex flex-col gap-1/2 text-text-sm text-grayTextPrimary'>
              <div className='flex justify-between'>
                <span>{t("treasury.modal.treasury")}</span>
                <span className='font-medium text-text'>
                  {treasuryAda.toFixed(2)} ADA
                </span>
              </div>
              <div className='flex justify-between'>
                <span>{t("treasury.modal.cexplorer")}</span>
                <span className='font-medium text-text'>
                  {cexplorerAda.toFixed(2)} ADA
                </span>
              </div>
            </div>
          </div>
        )}

        <div className='flex w-full justify-end gap-2'>
          <Button
            label={t("actions.cancel")}
            size='lg'
            variant='secondary'
            onClick={onClose}
            disabled={isSubmitting}
          />
          <div className='h-fit'>
            <Tooltip
              content={
                <div className='max-w-[150px]'>
                  {t("treasury.modal.meshJsNote")}
                </div>
              }
              forceDirection='top'
            >
              <Button
                label={isSubmitting ? t("treasury.modal.submitting") : t("treasury.modal.donate")}
                size='lg'
                variant='primary'
                leftIcon={<Wallet />}
                onClick={handleDonationClick}
                disabled={!isValidAmount || isSubmitting || !wallet}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </Modal>
  );
};
