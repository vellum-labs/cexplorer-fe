import { useState, useRef, useEffect } from "react";
import { useGlobalSearch } from "@vellumlabs/cexplorer-sdk";
import { useClickOutsideGroup } from "@/hooks/useClickOutsideGroup";
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

const STORAGE_KEY = "promotion_selected_item";

export const usePromotion = () => {
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
    "onetime",
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
    switch (selectedType) {
      case "pool":
      case "drep":
      case "asset":
      case "policy":
        return item.category === selectedType;
      default:
        return false;
    }
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

  const handleTypeChange = (type: PromotionType) => {
    setSelectedType(type);
    setSelectedItem(null);
    handleSearchChange("");
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

  return {
    // State
    selectedType,
    selectedItem,
    billingPeriod,
    localFocused,
    validation,
    paymentLoading,
    paymentError,
    searchRef,
    search,
    filteredResults,
    stripeActive,
    price,
    isMiscApiLoading,
    canProceedToPayment,
    // Actions
    setLocalFocused,
    setBillingPeriod,
    handleSearchChange,
    handleSelect,
    handleTypeChange,
    handlePayment,
  };
};

export type { SelectedItem, ValidationState };
