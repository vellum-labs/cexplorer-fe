import type { FC } from "react";
import { useState, useMemo } from "react";
import { Modal, Button, TextInput, cn } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { DONATION_OPTIONS } from "@/constants/wallet";
import { Link } from "lucide-react";

interface PaymentModalProps {
  address: string;
  onClose: () => void;
  onSign: (amount: number, donationAmount: number) => void;
}

export const PaymentModal: FC<PaymentModalProps> = ({
  address,
  onClose,
  onSign,
}) => {
  const { t } = useAppTranslation("common");
  const [amount, setAmount] = useState<string>("");
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const formattedAddress = useMemo(() => {
    if (address.length <= 5) return address;
    const prefix = address.slice(0, 15);
    const suffix = address.slice(-15);
    const lastFive = address.slice(-5);
    return (
      <>
        {prefix}...{suffix.slice(0, -5)}
        <span className='text-primary'>{lastFive}</span>
      </>
    );
  }, [address]);

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setAmount(value);
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
  };

  const handleSign = () => {
    const numAmount = Number(amount) || 0;
    onSign(numAmount, selectedDonation ?? 0);
  };

  const handleGenerateLink = () => {
    const numAmount = Number(amount) || 0;
    const donationAmount = selectedDonation ?? 0;
    const params = new URLSearchParams({
      to: address,
      amount: String(numAmount),
      donation: String(donationAmount),
    });
    const link = `${window.location.origin}/tx/submit?${params.toString()}`;
    navigator.clipboard.writeText(link);
  };

  const isValidAmount = amount && Number(amount) > 0;

  return (
    <Modal maxWidth='min(480px, 95vw)' maxHeight='90vh' onClose={onClose}>
      <div className='flex w-full flex-col gap-2 p-4'>
        <h2 className='text-text-lg font-semibold'>
          {t("wallet.payment.title")}
        </h2>
        <p className='text-text-sm text-grayTextPrimary'>
          {t("wallet.payment.description")}
        </p>

        <div className='flex flex-col gap-1'>
          <label className='text-text-sm font-medium'>
            {t("wallet.payment.address")}{" "}
            <span className='text-primary'>*</span>
          </label>
          <div className='flex h-10 w-full items-center rounded-m border border-border bg-cardBg px-3 text-text-sm'>
            <span className='truncate font-medium'>{formattedAddress}</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-text-sm font-medium'>
            {t("wallet.payment.amount")} <span className='text-primary'>*</span>
          </label>
          <TextInput
            inputClassName='h-10'
            wrapperClassName='w-full'
            value={amount}
            onchange={handleAmountChange}
            placeholder='0'
          />
        </div>

        <div className='mt-2'>
          <h3 className='font-medium'>{t("wallet.payment.addDonation")}</h3>
          <p className='mt-1 text-text-sm text-grayTextPrimary'>
            {t("wallet.payment.donationDescription")}
          </p>

          <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
            {DONATION_OPTIONS.map(option => {
              const Icon = option.icon;
              const isSelected = selectedDonation === option.value;
              const label = t(
                `wallet.payment.${option.labelKey}`,
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
                    className='h-4 w-4 shrink-0 accent-primary'
                  />
                  {Icon && <Icon size={18} className='shrink-0 text-primary' />}
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

        <div className='mt-4 flex items-center justify-between'>
          <Button
            label={t("wallet.payment.generateLink")}
            variant='secondary'
            size='md'
            leftIcon={<Link size={16} />}
            onClick={handleGenerateLink}
            disabled={!isValidAmount}
          />
          <Button
            label={t("wallet.payment.signTransaction")}
            variant='primary'
            size='md'
            onClick={handleSign}
            disabled={!isValidAmount}
          />
        </div>
      </div>
    </Modal>
  );
};
