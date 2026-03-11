import { useState, useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { Button, TextInput, cn, formatNumber } from "@vellumlabs/cexplorer-sdk";
import {
  Info,
  Link as LinkIcon,
  QrCode,
  CreditCard,
  Wallet,

} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { DONATION_OPTIONS } from "@/constants/wallet";
import { useWalletStore } from "@/stores/walletStore";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { handlePayment } from "@/utils/wallet/handlePayment";
import { HandleSelector } from "@/components/payment/HandleSelector";
import { AddressSelector } from "@/components/payment/AddressSelector";
import { GenerateLinkModal } from "@/components/payment/GenerateLinkModal";
import { MobilePaymentModal } from "@/components/payment/MobilePaymentModal";
import { fetchAddressDetail } from "@/services/address";
import {
  decodePaymentData,
  encodePaymentData,
} from "@/utils/payment/paymentLink";
import { openChangelly } from "@/utils/payment/changelly";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";

interface HandleData {
  name: string;
  address: string;
}

const hexToString = (hex: string): string => {
  const cleanHex = hex.startsWith("000de140") ? hex.slice(8) : hex;
  let str = "";
  for (let i = 0; i < cleanHex.length; i += 2) {
    str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
  }
  return str;
};

const PAY_STORAGE_KEY = "pay_form_data";

type PayMode = "creator" | "payer";

export const PayPage = () => {
  const { t } = useAppTranslation("common");
  const { wallet, address: walletAddress, walletType } = useWalletStore();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/pay/" });
  const { todayValue: adaPrice } = useAdaPriceWithHistory("usd");

  const [mode, setMode] = useState<PayMode>("creator");
  const [selectedHandle, setSelectedHandle] = useState<HandleData | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const isReadOnly = mode === "payer";

  useEffect(() => {
    if (isInitialized) return;

    if (searchParams.data) {
      const decoded = decodePaymentData(searchParams.data);
      if (decoded) {
        setMode("payer");
        if (decoded.address) setSelectedAddress(decoded.address);
        if (decoded.amount) setAmount(decoded.amount);
        if (decoded.message) setMessage(decoded.message);
        if (decoded.handle) {
          setSelectedHandle({
            name: decoded.handle,
            address: decoded.address || "",
          });
        }
        if (decoded.donation !== undefined && decoded.donation !== null) {
          setSelectedDonation(decoded.donation);
        }
      }
    } else {
      setMode("creator");
      const saved = localStorage.getItem(PAY_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.address) {
          setSelectedAddress(data.address);
          fetchHandleForAddress(data.address);
        }
        if (data.handle) {
          setSelectedHandle({
            name: data.handle,
            address: data.address || "",
          });
        }
        if (data.amount) setAmount(data.amount);
        if (data.donation !== null && data.donation !== undefined) {
          setSelectedDonation(data.donation);
        }
        if (data.message) setMessage(data.message);
      }
    }
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  useEffect(() => {
    if (!isInitialized || isReadOnly) return;

    const encoded = selectedAddress
      ? encodePaymentData({
          address: selectedAddress,
          amount: amount || undefined,
          message: message || undefined,
          handle: selectedHandle?.name,
          donation: selectedDonation ?? undefined,
        })
      : undefined;

    navigate({
      to: "/pay",
      search: { data: encoded },
      replace: true,
    });

    const storageData = {
      address: selectedAddress,
      handle: selectedHandle?.name || null,
      amount,
      donation: selectedDonation,
      message: message || null,
    };
    localStorage.setItem(PAY_STORAGE_KEY, JSON.stringify(storageData));
  }, [
    selectedAddress,
    selectedHandle,
    amount,
    selectedDonation,
    message,
    isInitialized,
    isReadOnly,
    navigate,
  ]);

  const fetchHandleForAddress = async (address: string) => {
    const response = await fetchAddressDetail({ view: address });
    const addressData = response.data?.data?.[0];
    if (addressData?.adahandle?.hex) {
      const handleName = hexToString(addressData.adahandle.hex);
      setSelectedHandle({ name: handleName, address });
    }
  };

  const handleSelectHandle = (handle: HandleData | null) => {
    setSelectedHandle(handle);
    if (handle?.address) {
      setSelectedAddress(handle.address);
    } else {
      setSelectedAddress(null);
    }
  };

  const handleSelectAddress = (address: string | null) => {
    setSelectedAddress(address);
    if (!address) {
      setSelectedHandle(null);
    } else if (!selectedHandle) {
      fetchHandleForAddress(address);
    }
  };

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setAmount(value);
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
  };

  const handleEdit = () => {
    setMode("creator");
    navigate({
      to: "/pay",
      search: {
        data: selectedAddress
          ? encodePaymentData({
              address: selectedAddress,
              amount: amount || undefined,
              message: message || undefined,
              handle: selectedHandle?.name,
              donation: selectedDonation ?? undefined,
            })
          : undefined,
      },
      replace: true,
    });
  };

  const isValidAmount = amount && Number(amount) > 0;
  const isDonationSelected = selectedDonation !== null;
  const isFormValid = isValidAmount && isDonationSelected && !!selectedAddress;

  const paymentData = {
    address: selectedAddress || "",
    amount: amount || undefined,
    message: message || undefined,
    handle: selectedHandle?.name,
    donation: selectedDonation ?? undefined,
  };

  const handleSign = async () => {
    if (!wallet || !walletAddress || !walletType) {
      setShowWalletModal(true);
      return;
    }
    if (!selectedAddress) return;
    await handlePayment(
      {
        toAddress: selectedAddress,
        amount: Number(amount) || 0,
        donationAmount: selectedDonation ?? 0,
        message: message || undefined,
      },
      wallet,
    );
  };

  const handlePayWithCard = () => {
    if (!selectedAddress) return;
    openChangelly({ address: selectedAddress, amount: amount || undefined, adaPrice: adaPrice || undefined });
  };

  const usdEquivalent =
    adaPrice && amount && Number(amount) > 0
      ? `$${formatNumber((Number(amount) * adaPrice).toFixed(2))}`
      : null;

  return (
    <PageBase
      metadataOverride={{
        title: t("wallet.payment.pageTitle", "Payment | Cexplorer.io"),
      }}
      title={t("wallet.payment.title")}
      breadcrumbItems={[{ label: t("wallet.payment.title") }]}
      adsCarousel={false}
      customPage={true}
    >
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      {showGenerateLinkModal && (
        <GenerateLinkModal
          paymentData={paymentData}
          onClose={() => setShowGenerateLinkModal(false)}
        />
      )}
      {showMobileModal && (
        <MobilePaymentModal
          paymentData={paymentData}
          onClose={() => setShowMobileModal(false)}
        />
      )}

      <section className='flex w-full max-w-desktop flex-col gap-4 px-mobile pb-3 md:px-desktop'>
        <div className='flex items-center gap-3 rounded-l border border-border bg-darker p-4'>
          <div className='bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-max'>
            <Info size={18} className='text-primary' />
          </div>
          <p className='text-text-sm text-grayTextPrimary'>
            {t(
              "wallet.payment.disclaimer",
              "This payment is executed directly on the Cardano blockchain. We do not custody funds or process transactions. You generate and sign the transaction using your own wallet.",
            )}
          </p>
        </div>

        {isReadOnly && (
          <div className='flex items-center justify-between gap-3 rounded-l border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-max bg-[#F59E0B]/20'>
                <Info size={18} className='text-[#F59E0B]' />
              </div>
              <p className='text-text-sm text-[#F59E0B]'>
                {t(
                  "wallet.payment.predefinedBanner",
                  "You're visiting a predefined payment.",
                )}
              </p>
            </div>
            <button
              onClick={handleEdit}
              className='shrink-0 text-text-sm font-medium text-[#F59E0B] hover:underline'
            >
              {t("wallet.payment.edit", "Edit")}
            </button>
          </div>
        )}

        <div className='rounded-l border border-border bg-cardBg p-4'>
          <h2 className='text-text-lg font-semibold'>
            {t("wallet.payment.detailsTitle", "Payment details")}
          </h2>
          <p className='mt-1 text-text-sm text-grayTextPrimary'>
            {t(
              "wallet.payment.detailsDescription",
              "Fill in payment details to generate a transaction.",
            )}
          </p>

          {!isReadOnly && (
            <div className='mt-4 flex flex-col gap-1'>
              <label className='text-text-sm font-medium'>
                {t("wallet.payment.handle", "Handle")}
              </label>
              <HandleSelector
                selectedHandle={selectedHandle}
                onSelectHandle={handleSelectHandle}
              />
            </div>
          )}

          <div className='mt-4 flex flex-col gap-1'>
            <label className='text-text-sm font-medium'>
              {t("wallet.payment.address")}{" "}
              <span className='text-primary'>*</span>
            </label>
            <AddressSelector
              selectedAddress={selectedAddress}
              onSelectAddress={handleSelectAddress}
              disabled={isReadOnly}
            />
          </div>

          <div className='mt-4 flex flex-col gap-1'>
            <label className='text-text-sm font-medium'>
              {t("wallet.payment.amount")}{" "}
              <span className='text-primary'>*</span>
            </label>
            <div className='relative'>
              <TextInput
                inputClassName='h-10'
                wrapperClassName='w-full'
                value={amount}
                onchange={handleAmountChange}
                placeholder='0'
                disabled={isReadOnly}
              />
              {usdEquivalent && (
                <span className='absolute right-8 top-1/2 -translate-y-1/2 text-text-sm text-grayTextPrimary'>
                  {usdEquivalent}
                </span>
              )}
            </div>
          </div>

          <div className='mt-4 flex flex-col gap-1'>
            <label className='text-text-sm font-medium'>
              {t("wallet.payment.message", "Message")}
            </label>
            <TextInput
              inputClassName='h-10'
              wrapperClassName='w-full'
              value={message}
              onchange={setMessage}
              placeholder={t(
                "wallet.payment.messagePlaceholder",
                "Optional transaction message",
              )}
              maxLength={256}
              disabled={isReadOnly}
            />
            <span className='text-text-xs text-grayTextSecondary'>
              {t(
                "wallet.payment.messageHint",
                "Optional message stored on-chain (CIP-20)",
              )}
            </span>
          </div>

          <div className='mt-6'>
            <h3 className='font-medium'>
              {t(
                "wallet.payment.addDonationTitle",
                "Add donation to Cexplorer",
              )}
            </h3>
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
                      isReadOnly && "pointer-events-none opacity-60",
                    )}
                  >
                    <input
                      type='radio'
                      name='donation'
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setSelectedDonation(option.value)}
                      className='h-4 w-4 shrink-0 accent-primary'
                      disabled={isReadOnly}
                    />
                    {Icon && (
                      <Icon size={18} className='shrink-0 text-primary' />
                    )}
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

          <div className='mt-6 flex flex-col gap-2 [&>*]:w-full md:flex-row md:items-center md:justify-between md:[&>*]:w-auto'>
            {isReadOnly ? (
              <>
                <Button
                  label={t("wallet.payment.mobileWallet", "Mobile wallet")}
                  variant='secondary'
                  size='md'
                  leftIcon={<QrCode size={16} />}
                  onClick={() => setShowMobileModal(true)}
                  disabled={!isFormValid}
                  className='!w-full !max-w-full md:!w-auto md:!max-w-fit'
                />
                <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                  <Button
                    label={t("wallet.payment.payWithCard", "Pay with Card")}
                    variant='primary'
                    size='md'
                    leftIcon={<CreditCard size={16} />}
                    onClick={handlePayWithCard}
                    disabled={!selectedAddress}
                    className='!w-full !max-w-full md:!w-auto md:!max-w-fit'
                  />
                  <Button
                    label={t("wallet.payment.payWithWallet", "Pay with Wallet")}
                    variant='primary'
                    size='md'
                    leftIcon={<Wallet size={16} />}
                    onClick={handleSign}
                    disabled={!isFormValid}
                    className='!w-full !max-w-full md:!w-auto md:!max-w-fit'
                  />
                </div>
              </>
            ) : (
              <>
                <Button
                  label={t("wallet.payment.generateLink")}
                  variant='secondary'
                  size='md'
                  leftIcon={<LinkIcon size={16} />}
                  onClick={() => setShowGenerateLinkModal(true)}
                  disabled={!isFormValid}
                  className='!w-full !max-w-full md:!w-auto md:!max-w-fit'
                />
                <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                  <Button
                    label={t("wallet.payment.payWithCard", "Pay with Card")}
                    variant='primary'
                    size='md'
                    leftIcon={<CreditCard size={16} />}
                    onClick={handlePayWithCard}
                    disabled={!selectedAddress}
                    className='!w-full !max-w-full md:!w-auto md:!max-w-fit'
                  />
                  <Button
                    label={t("wallet.payment.payWithWallet", "Pay with Wallet")}
                    variant='primary'
                    size='md'
                    leftIcon={<Wallet size={16} />}
                    onClick={handleSign}
                    disabled={!isFormValid}
                    className='!w-full !max-w-full md:!w-auto md:!max-w-fit'
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </PageBase>
  );
};
