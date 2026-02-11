import { useState, useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import { Button, TextInput, cn } from "@vellumlabs/cexplorer-sdk";
import { Info, Link as LinkIcon } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { DONATION_OPTIONS } from "@/constants/wallet";
import { useWalletStore } from "@/stores/walletStore";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { handlePayment } from "@/utils/wallet/handlePayment";
import { HandleSelector } from "@/components/payment/HandleSelector";
import { AddressSelector } from "@/components/payment/AddressSelector";
import { fetchAddressDetail } from "@/services/address";
import { toast } from "sonner";

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

export const PayPage = () => {
  const { t } = useAppTranslation("common");
  const { wallet, address: walletAddress, walletType } = useWalletStore();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/pay/" });

  const [selectedHandle, setSelectedHandle] = useState<HandleData | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (isInitialized) return;

    const hasUrlParams =
      searchParams.to || searchParams.amount || searchParams.donation;

    if (hasUrlParams) {
      if (searchParams.to) {
        setSelectedAddress(searchParams.to);
        fetchHandleForAddress(searchParams.to);
      }
      if (searchParams.handle) {
        setSelectedHandle({
          name: searchParams.handle,
          address: searchParams.to || "",
        });
      }
      if (searchParams.amount) {
        setAmount(searchParams.amount);
      }
      if (searchParams.donation) {
        const donationValue = Number(searchParams.donation);
        if (!isNaN(donationValue)) {
          setSelectedDonation(donationValue);
        }
      }
    } else {
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
        if (data.amount) {
          setAmount(data.amount);
        }
        if (data.donation !== null && data.donation !== undefined) {
          setSelectedDonation(data.donation);
        }
      }
    }
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    navigate({
      to: "/pay",
      search: {
        to: selectedAddress || undefined,
        handle: selectedHandle?.name || undefined,
        amount: amount || undefined,
        donation:
          selectedDonation !== null ? String(selectedDonation) : undefined,
      },
      replace: true,
    });

    const storageData = {
      address: selectedAddress,
      handle: selectedHandle?.name || null,
      amount: amount,
      donation: selectedDonation,
    };
    localStorage.setItem(PAY_STORAGE_KEY, JSON.stringify(storageData));
  }, [
    selectedAddress,
    selectedHandle,
    amount,
    selectedDonation,
    isInitialized,
    navigate,
  ]);

  const fetchHandleForAddress = async (address: string) => {
    const response = await fetchAddressDetail({ view: address });
    const addressData = response.data?.data?.[0];
    if (addressData?.adahandle?.hex) {
      const handleName = hexToString(addressData.adahandle.hex);
      setSelectedHandle({
        name: handleName,
        address: address,
      });
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

  const isValidAmount = amount && Number(amount) > 0;
  const isDonationSelected = selectedDonation !== null;
  const isFormValid = isValidAmount && isDonationSelected && !!selectedAddress;

  const handleGenerateLink = () => {
    if (!selectedAddress) return;
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("wallet.payment.linkCopied", "Link copied to clipboard"));
  };

  const handleSign = async () => {
    if (!wallet || !walletAddress || !walletType) {
      setShowWalletModal(true);
      return;
    }

    if (!selectedAddress) return;

    const numAmount = Number(amount) || 0;
    await handlePayment(
      {
        toAddress: selectedAddress,
        amount: numAmount,
        donationAmount: selectedDonation ?? 0,
      },
      wallet,
    );
  };

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

          <div className='mt-4 flex flex-col gap-1'>
            <label className='text-text-sm font-medium'>
              {t("wallet.payment.handle", "Handle")}
            </label>
            <HandleSelector
              selectedHandle={selectedHandle}
              onSelectHandle={handleSelectHandle}
            />
          </div>

          <div className='mt-4 flex flex-col gap-1'>
            <label className='text-text-sm font-medium'>
              {t("wallet.payment.address")}{" "}
              <span className='text-primary'>*</span>
            </label>
            <AddressSelector
              selectedAddress={selectedAddress}
              onSelectAddress={handleSelectAddress}
            />
          </div>

          <div className='mt-4 flex flex-col gap-1'>
            <label className='text-text-sm font-medium'>
              {t("wallet.payment.amount")}{" "}
              <span className='text-primary'>*</span>
            </label>
            <TextInput
              inputClassName='h-10'
              wrapperClassName='w-full'
              value={amount}
              onchange={handleAmountChange}
              placeholder='0'
            />
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

          <div className='mt-6 flex flex-col items-center gap-2 min-[400px]:flex-row min-[400px]:justify-between'>
            <Button
              label={t("wallet.payment.generateLink")}
              variant='secondary'
              size='md'
              leftIcon={<LinkIcon size={16} />}
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
      </section>
    </PageBase>
  );
};
