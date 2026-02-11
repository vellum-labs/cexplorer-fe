import type { FC } from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Button,
  TextInput,
  cn,
  useThemeStore,
} from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { DONATION_OPTIONS } from "@/constants/wallet";
import { Link, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { fetchAddressList } from "@/services/address";
import { formatAbbreviatedADA } from "@/utils/formatADA";

interface AddressOption {
  address: string;
  balance: number;
}

interface PaymentModalProps {
  address: string;
  onClose: () => void;
  onSign: (
    amount: number,
    donationAmount: number,
    selectedAddress?: string,
  ) => void;
}

export const PaymentModal: FC<PaymentModalProps> = ({
  address,
  onClose,
  onSign,
}) => {
  const { t } = useAppTranslation("common");
  const { theme } = useThemeStore();
  const [amount, setAmount] = useState<string>("");
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  const isStakeAddress = address.startsWith("stake");
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selectedPaymentAddress, setSelectedPaymentAddress] = useState<
    string | null
  >(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [showAddressDropdown, setShowAddressDropdown] =
    useState<boolean>(false);

  useEffect(() => {
    if (isStakeAddress) {
      setIsLoadingAddresses(true);
      fetchAddressList({
        view: address,
        order: "balance",
        limit: 50,
        offset: 0,
      })
        .then(response => {
          const addressList = response.data?.data || [];
          const options: AddressOption[] = addressList
            .map((item: any) => ({
              address: item.address,
              balance: item.balance || 0,
            }))
            .sort(
              (a: AddressOption, b: AddressOption) => b.balance - a.balance,
            );
          setAddresses(options);
          if (options.length > 0) {
            setSelectedPaymentAddress(options[0].address);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingAddresses(false);
        });
    }
  }, [address, isStakeAddress]);

  const effectiveAddress = isStakeAddress ? selectedPaymentAddress : address;

  const formattedAddress = useMemo(() => {
    const addr = effectiveAddress || address;
    if (addr.length <= 5) return addr;
    const prefix = addr.slice(0, 15);
    const suffix = addr.slice(-15);
    const lastFive = addr.slice(-5);
    return (
      <>
        {prefix}...{suffix.slice(0, -5)}
        <span className='text-primary'>{lastFive}</span>
      </>
    );
  }, [effectiveAddress, address]);

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setAmount(value);
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
  };

  const handleSign = () => {
    if (!effectiveAddress) return;
    const numAmount = Number(amount) || 0;
    onSign(numAmount, selectedDonation ?? 0, effectiveAddress);
  };

  const handleGenerateLink = () => {
    if (!effectiveAddress) return;
    const numAmount = Number(amount) || 0;
    const donationAmount = selectedDonation ?? 0;
    const params = new URLSearchParams({
      to: effectiveAddress,
      amount: String(numAmount),
      donation: String(donationAmount),
    });
    const link = `${window.location.origin}/pay?${params.toString()}`;
    navigator.clipboard.writeText(link);
    toast.success(t("wallet.payment.linkCopied", "Link copied to clipboard"));
  };

  const isValidAmount = amount && Number(amount) > 0;
  const isDonationSelected = selectedDonation !== null;
  const hasValidAddress = isStakeAddress ? !!selectedPaymentAddress : true;
  const isFormValid = isValidAmount && isDonationSelected && hasValidAddress;

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
            {isStakeAddress
              ? t("wallet.payment.selectAddress", "Select address")
              : t("wallet.payment.address")}{" "}
            <span className='text-primary'>*</span>
          </label>
          {isStakeAddress ? (
            <div className='relative'>
              {isLoadingAddresses ? (
                <div className='flex h-10 w-full items-center justify-center rounded-m border border-border bg-cardBg'>
                  <div
                    className={`loader h-5 w-5 border-2 ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"}`}
                  />
                </div>
              ) : addresses.length === 0 ? (
                <div className='flex h-10 w-full items-center rounded-m border border-border bg-cardBg px-3 text-text-sm text-grayTextPrimary'>
                  {t("wallet.payment.noAddressesFound", "No addresses found")}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                    className='flex h-10 w-full cursor-pointer items-center justify-between rounded-m border border-border bg-cardBg px-3 text-left text-text-sm hover:opacity-80'
                  >
                    <div className='flex min-w-0 font-medium'>
                      <span className='truncate'>
                        {effectiveAddress?.slice(0, -5)}
                      </span>
                      <span className='shrink-0 text-primary'>
                        {effectiveAddress?.slice(-5)}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "ml-2 shrink-0 transition-transform",
                        showAddressDropdown && "rotate-180",
                      )}
                    />
                  </button>
                  {showAddressDropdown && (
                    <div className='absolute z-50 mt-1 flex w-full flex-col rounded-m border border-border bg-background shadow-lg'>
                      <div className='thin-scrollbar max-h-[200px] overflow-auto'>
                        {addresses.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedPaymentAddress(item.address);
                              setShowAddressDropdown(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-darker",
                              selectedPaymentAddress === item.address &&
                                "bg-primary/5",
                            )}
                          >
                            <div className='flex min-w-0 text-text-sm'>
                              <span className='truncate'>
                                {item.address.slice(0, -5)}
                              </span>
                              <span className='shrink-0 text-primary'>
                                {item.address.slice(-5)}
                              </span>
                            </div>
                            <span className='ml-2 shrink-0 text-text-xs text-grayTextPrimary'>
                              {formatAbbreviatedADA(item.balance)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success(
                  t(
                    "wallet.payment.addressCopied",
                    "Address copied to clipboard",
                  ),
                );
              }}
              className='flex h-10 w-full cursor-pointer items-center rounded-m border border-border bg-cardBg px-3 text-left text-text-sm hover:opacity-80'
            >
              <span className='truncate font-medium'>{formattedAddress}</span>
            </button>
          )}
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

          <div className='mt-4 flex flex-col gap-2'>
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
            disabled={!isFormValid}
          />
          <Button
            label={t("wallet.payment.signTransaction")}
            variant='primary'
            size='md'
            onClick={handleSign}
            disabled={!isFormValid}
          />
        </div>
      </div>
    </Modal>
  );
};
