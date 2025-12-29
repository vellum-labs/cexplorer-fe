import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { PageBase } from "@/components/global/pages/PageBase";
import {
  Button,
  TextInput,
  useGlobalSearch,
  AdCard,
  formatString,
} from "@vellumlabs/cexplorer-sdk";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CircleAlert, Search, AlertTriangle, Loader2 } from "lucide-react";
import { useClickOutsideGroup } from "@/hooks/useClickOutsideGroup";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useFetchMiscApi, miscValidate, miscPayment } from "@/services/misc";
import type { MiscValidatePreview } from "@/types/userTypes";
import type { PromotionType } from "@/types/miscTypes";

interface SelectedItem {
  id: string;
  name: string;
  type: PromotionType;
}

interface ValidationState {
  isLoading: boolean;
  error: string | null;
  preview: MiscValidatePreview | null;
}

const promotionTypes = [
  { key: "pool" as PromotionType, label: "Stake pool" },
  { key: "drep" as PromotionType, label: "DRep" },
  { key: "asset" as PromotionType, label: "Asset" },
  { key: "policy" as PromotionType, label: "Policy ID" },
];

const STORAGE_KEY = "promotion_selected_item";

export const PromotionPage = () => {
  const [selectedType, setSelectedType] = useState<PromotionType>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SelectedItem;
      return parsed.type;
    }
    return "pool";
  });
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [billingPeriod, setBillingPeriod] = useState<"renewal" | "onetime">(
    "renewal",
  );
  const [localFocused, setLocalFocused] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    isLoading: false,
    error: null,
    preview: null,
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: miscApiData, isLoading: isMiscApiLoading } = useFetchMiscApi();
  const { search, handleSearchChange, data } = useGlobalSearch();

  const stripeActive = !!miscApiData?.data?.stripe?.active;
  const price = miscApiData?.data?.stripe?.price ?? 100;

  useEffect(() => {
    if (selectedItem) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItem));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) {
      setValidation({ isLoading: false, error: null, preview: null });
      return;
    }

    const validateItem = async () => {
      setValidation({ isLoading: true, error: null, preview: null });

      try {
        const response = await miscValidate(selectedItem.type, selectedItem.id);

        if (response.code !== 200) {
          setValidation({
            isLoading: false,
            error: response.msg || "Validation failed",
            preview: null,
          });
          return;
        }

        if (!response.data.valid) {
          setValidation({
            isLoading: false,
            error: "Item not found or does not exist",
            preview: null,
          });
          return;
        }

        if (response.data.preview === false) {
          setValidation({
            isLoading: false,
            error: "Promotion is not available for this item",
            preview: null,
          });
          return;
        }

        setValidation({
          isLoading: false,
          error: null,
          preview: response.data.preview,
        });
      } catch {
        setValidation({
          isLoading: false,
          error: "Failed to validate item. Please try again.",
          preview: null,
        });
      }
    };

    validateItem();
  }, [selectedItem]);

  const filteredResults = data.filter(item => {
    if (selectedType === "pool") return item.category === "pool";
    if (selectedType === "drep") return item.category === "drep";
    if (selectedType === "asset") return item.category === "asset";
    if (selectedType === "policy") return item.category === "policy";
    return false;
  });

  useClickOutsideGroup([searchRef], () => {
    setLocalFocused(false);
  });

  const handleSelect = (item: any) => {
    const id = item.url.split("/").pop() || "";
    setSelectedItem({
      id,
      name: item.title,
      type: selectedType,
    });
    handleSearchChange("");
    setLocalFocused(false);
    setPaymentError(null);
  };

  const handlePayment = async () => {
    if (!selectedItem || !validation.preview) return;

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const action =
        billingPeriod === "renewal" ? "payment_recurring" : "payment_one_time";
      const response = await miscPayment(
        action,
        selectedItem.type,
        selectedItem.id,
      );

      if (response.code === 429) {
        setPaymentError("Too many requests. Please try again later.");
        return;
      }

      if (response.code !== 200) {
        setPaymentError(response.msg || "Payment request failed");
        return;
      }

      if (!response.data.ok) {
        setPaymentError(response.data.msg || "Payment failed");
        return;
      }

      if (response.data.redir) {
        window.open(response.data.redir, "_blank");
      }
    } catch {
      setPaymentError("Failed to process payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const canProceedToPayment =
    selectedItem && validation.preview && !validation.error && stripeActive;

  if (isMiscApiLoading) {
    return (
      <PageBase
        metadataOverride={{ title: "Promotion | Cexplorer.io" }}
        title='Promotion'
        subTitle='Promote your Cardano project'
        breadcrumbItems={[
          { label: "Advertising", link: "/ads" },
          { label: "Promotion" },
        ]}
        adsCarousel={false}
        customPage={true}
      >
        <section className='flex w-full max-w-[800px] flex-col items-center gap-4 px-mobile py-4 md:px-desktop'>
          <div className='flex items-center gap-2'>
            <Loader2 className='animate-spin text-primary' size={24} />
            <span>Loading...</span>
          </div>
        </section>
      </PageBase>
    );
  }

  if (!stripeActive) {
    return (
      <PageBase
        metadataOverride={{ title: "Promotion | Cexplorer.io" }}
        title='Promotion'
        subTitle='Promote your Cardano project'
        breadcrumbItems={[
          { label: "Advertising", link: "/ads" },
          { label: "Promotion" },
        ]}
        adsCarousel={false}
        customPage={true}
      >
        <section className='flex w-full max-w-[800px] flex-col items-center gap-4 px-mobile py-4 md:px-desktop'>
          <div className='bg-yellow-500/10 flex w-full items-start gap-2 rounded-m border border-yellow-500 p-4'>
            <AlertTriangle className='mt-0.5 text-yellow-500' size={18} />
            <div>
              <p className='font-semibold text-yellow-500'>
                Feature Not Available
              </p>
              <p className='text-text-sm text-text'>
                The promotion feature is currently not available. Please try
                again later.
              </p>
            </div>
          </div>
        </section>
      </PageBase>
    );
  }

  return (
    <PageBase
      metadataOverride={{ title: "Promotion | Cexplorer.io" }}
      title='Promotion'
      subTitle='Promote your Cardano project'
      breadcrumbItems={[
        { label: "Advertising", link: "/ads" },
        { label: "Promotion" },
      ]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-[800px] flex-col items-center gap-4 px-mobile py-4 md:px-desktop'>
        <div className='flex w-full items-start gap-2 rounded-m border border-border p-2'>
          <CircleAlert className='mt-0.5 text-primary' size={18} />
          <p className='text-text-sm text-text'>
            Promote your stake pool, DRep, asset, or policy on Cexplorer.
            Featured listings get rotating banner ads and enhanced visibility to
            reach more users.
          </p>
        </div>

        <div className='flex w-full flex-col gap-4 rounded-l border border-border bg-cardBg p-4'>
          <div>
            <h3 className='text-text-lg font-semibold'>Promotion type</h3>
            <p className='text-text-sm text-grayTextPrimary'>
              Select what you want to promote on Cexplorer.
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {promotionTypes.map(type => (
              <Button
                key={type.key}
                variant={selectedType === type.key ? "primary" : "tertiary"}
                size='sm'
                label={type.label}
                className='!border !border-border'
                onClick={() => {
                  setSelectedType(type.key);
                  setSelectedItem(null);
                  handleSearchChange("");
                  setPaymentError(null);
                }}
              />
            ))}
          </div>

          <div className='relative' ref={searchRef}>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <TextInput
                  placeholder={`Search for ${selectedType}...`}
                  value={search}
                  onchange={(value: string) => {
                    handleSearchChange(value);
                    setLocalFocused(true);
                  }}
                  onFocus={() => setLocalFocused(true)}
                />
                {localFocused && search && filteredResults.length > 0 && (
                  <div className='absolute left-0 top-full z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-m border border-border bg-cardBg shadow-lg'>
                    {filteredResults.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(item)}
                        className='hover:bg-hover flex w-full items-center gap-2 px-3 py-2 text-left'
                      >
                        <span className='text-text-sm'>{item.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant='primary'
                size='md'
                leftIcon={<Search size={18} />}
              />
            </div>
          </div>

          {validation.isLoading && (
            <div className='flex items-center gap-2 text-text-sm text-grayTextPrimary'>
              <Loader2 className='animate-spin' size={16} />
              <span>Validating...</span>
            </div>
          )}

          {validation.error && (
            <div className='flex items-start gap-2 rounded-m border border-red-500 bg-red-500/10 p-2'>
              <AlertTriangle className='mt-0.5 text-red-500' size={18} />
              <p className='text-text-sm text-red-500'>{validation.error}</p>
            </div>
          )}

          {selectedItem && !validation.isLoading && !validation.error && (
            <div className='flex flex-col gap-2 text-text-sm'>
              <div className='flex justify-between'>
                <span className='text-grayTextPrimary'>Type</span>
                <span className='capitalize'>
                  {selectedItem.type === "pool"
                    ? "Stake pool"
                    : selectedItem.type}
                </span>
              </div>
              {selectedItem.type !== "policy" && (
                <div className='flex justify-between'>
                  <span className='text-grayTextPrimary'>Name</span>
                  <Link
                    to={`/${selectedItem.type}/${selectedItem.id}` as any}
                    className='text-primary'
                  >
                    {selectedItem.name}
                  </Link>
                </div>
              )}
              <div className='flex justify-between'>
                <span className='text-grayTextPrimary'>
                  {selectedItem.type === "pool" ? "Pool ID" : "ID"}
                </span>
                <Link
                  to={`/${selectedItem.type}/${selectedItem.id}` as any}
                  className='font-mono text-primary'
                >
                  {formatString(selectedItem.id, "long")}
                </Link>
              </div>
              {validation.preview && (
                <div className='flex flex-col gap-2 md:flex-row md:justify-between'>
                  <span className='text-grayTextPrimary'>Preview</span>
                  <div className='w-full md:w-[340px]'>
                    <AdCard
                      data={{
                        type: validation.preview.type,
                        title: validation.preview.title,
                        text: validation.preview.text || "",
                        link: validation.preview.link,
                        content: validation.preview.content || "",
                        section: validation.preview.section || "",
                        icon: (validation.preview.icon as any) || "star",
                      }}
                      generateImageUrl={generateImageUrl}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className='flex items-start gap-2 rounded-m border border-border p-2'>
            <CircleAlert className='mt-0.5 text-primary' size={18} />
            <p className='text-text-sm text-text'>
              Banner promotion appears on multiple pages across Cexplorer,
              maximizing reach and visibility.
            </p>
          </div>
        </div>

        <div className='flex w-full flex-col gap-4 rounded-l border border-border bg-cardBg p-4'>
          <div>
            <h3 className='text-text-lg font-semibold'>Promotion period</h3>
            <p className='text-text-sm text-grayTextPrimary'>
              Choose your billing preference and promotion duration.
            </p>
          </div>

          <RadioGroup
            value={billingPeriod}
            onValueChange={(value: "renewal" | "onetime") =>
              setBillingPeriod(value)
            }
          >
            <div
              className='flex cursor-pointer items-center justify-between rounded-m border border-border p-4'
              onClick={() => setBillingPeriod("renewal")}
            >
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='renewal' id='renewal' />
                <Label htmlFor='renewal' className='cursor-pointer'>
                  <div className='font-semibold'>30 Days - Renewal</div>
                  <div className='text-text-sm text-grayTextPrimary'>
                    Renews every 30 days - Rotation Banners
                  </div>
                </Label>
              </div>
              <div className='text-right'>
                <div className='text-primary-500 text-text-lg font-semibold'>
                  ${price}
                </div>
                <div className='text-text-sm text-grayTextPrimary'>
                  Monthly, USD
                </div>
              </div>
            </div>

            <div
              className='flex cursor-pointer items-center justify-between rounded-m border border-border p-4'
              onClick={() => setBillingPeriod("onetime")}
            >
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='onetime' id='onetime' />
                <Label htmlFor='onetime' className='cursor-pointer'>
                  <div className='font-semibold'>30 Days</div>
                  <div className='text-text-sm text-grayTextPrimary'>
                    30 days - Rotation Banners
                  </div>
                </Label>
              </div>
              <div className='text-right'>
                <div className='text-primary-500 text-text-lg font-semibold'>
                  ${price}
                </div>
                <div className='text-text-sm text-grayTextPrimary'>
                  One time, USD
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className='flex w-full flex-col gap-4 rounded-l border border-border bg-cardBg p-4'>
          <div>
            <h3 className='text-text-lg font-semibold'>Order summary</h3>
            <p className='text-text-sm text-grayTextPrimary'>
              Review your promotion details before payment.
            </p>
          </div>

          <div className='flex flex-col gap-2 rounded-m border border-border p-4 text-text-sm'>
            <div className='flex justify-between'>
              <span className='text-grayTextPrimary'>Type</span>
              <span className='capitalize'>
                {selectedItem
                  ? selectedItem.type === "pool"
                    ? "Stake pool"
                    : selectedItem.type
                  : "-"}
              </span>
            </div>
            {selectedItem?.type !== "policy" && (
              <div className='flex justify-between'>
                <span className='text-grayTextPrimary'>Name</span>
                {selectedItem ? (
                  <Link
                    to={`/${selectedItem.type}/${selectedItem.id}` as any}
                    className='text-primary'
                  >
                    {selectedItem.name}
                  </Link>
                ) : (
                  <span>-</span>
                )}
              </div>
            )}
            <div className='flex justify-between'>
              <span className='text-grayTextPrimary'>
                {selectedItem?.type === "pool" ? "Pool ID" : "ID"}
              </span>
              {selectedItem ? (
                <Link
                  to={`/${selectedItem.type}/${selectedItem.id}` as any}
                  className='font-mono text-primary'
                >
                  {formatString(selectedItem.id, "long")}
                </Link>
              ) : (
                <span>-</span>
              )}
            </div>
            <div className='flex justify-between'>
              <span className='text-grayTextPrimary'>Plan</span>
              <span>
                {billingPeriod === "renewal" ? "30 Days - Renewal" : "30 Days"}
              </span>
            </div>
            <div className='mt-2 flex justify-between border-t border-border pt-2'>
              <span className='font-semibold'>Total</span>
              <span className='text-primary-500 text-text-lg font-semibold'>
                ${price} {billingPeriod === "renewal" ? "monthly" : ""}
              </span>
            </div>
          </div>

          {paymentError && (
            <div className='flex items-start gap-2 rounded-m border border-red-500 bg-red-500/10 p-2'>
              <AlertTriangle className='mt-0.5 text-red-500' size={18} />
              <p className='text-text-sm text-red-500'>{paymentError}</p>
            </div>
          )}

          <div className='flex items-start gap-2 rounded-m border border-border p-2'>
            <CircleAlert className='mt-0.5 text-primary' size={18} />
            <p className='text-text-sm text-text'>
              Your promotion will be activated within one hour after payment
              confirmation. Payment is processed securely through Stripe.
            </p>
          </div>

          <Button
            variant='primary'
            size='lg'
            label={paymentLoading ? "Processing..." : "Pay with STRIPE"}
            className='w-full'
            disabled={!canProceedToPayment || paymentLoading}
            onClick={handlePayment}
            leftIcon={
              paymentLoading ? (
                <Loader2 className='animate-spin' size={18} />
              ) : undefined
            }
          />
        </div>
      </section>
    </PageBase>
  );
};
