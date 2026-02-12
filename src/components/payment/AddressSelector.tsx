import type { FC } from "react";
import { useState, useRef } from "react";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { useClickOutsideGroup } from "@/hooks/useClickOutsideGroup";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchMiscSearch } from "@/services/misc";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AddressSelectorProps {
  selectedAddress: string | null;
  onSelectAddress: (address: string | null) => void;
}

export const AddressSelector: FC<AddressSelectorProps> = ({
  selectedAddress,
  onSelectAddress,
}) => {
  const { t } = useAppTranslation("common");
  const [search, setSearch] = useState<string>("");
  const [localFocused, setLocalFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();

  const debouncedSearch = useDebounce(search, 300);
  const searchQuery = useFetchMiscSearch(
    debouncedSearch || undefined,
    "address",
  );

  const searchResults = Array.isArray(searchQuery.data?.data)
    ? searchQuery.data.data
    : searchQuery.data?.data
      ? [searchQuery.data.data]
      : [];
  const isLoading = searchQuery.isLoading || searchQuery.isFetching;

  useClickOutsideGroup([inputRef], () => {
    setLocalFocused(false);
    if (search.trim() && !selectedAddress && search.startsWith("addr")) {
      onSelectAddress(search.trim());
      setSearch("");
    }
  });

  const handleSelect = (item: any) => {
    const address = item.ident || item.url?.split("/").pop() || "";
    onSelectAddress(address);
    setSearch("");
    setLocalFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      if (search.startsWith("addr")) {
        onSelectAddress(search.trim());
        setSearch("");
        setLocalFocused(false);
      } else if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
      }
    }
  };

  const handleClear = () => {
    onSelectAddress(null);
    setSearch("");
  };

  return (
    <div className='relative w-full' ref={inputRef}>
      {selectedAddress ? (
        <div className='flex flex-col gap-1'>
          <div className='flex min-h-[40px] items-center justify-between gap-2 rounded-m border border-border bg-background px-3'>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedAddress);
                toast.success(
                  t(
                    "wallet.payment.addressCopied",
                    "Address copied to clipboard",
                  ),
                );
              }}
              className='flex min-w-0 cursor-pointer items-center text-text-sm font-medium hover:opacity-80'
            >
              <span className='truncate'>{selectedAddress.slice(0, -5)}</span>
              <span className='shrink-0 text-primary'>
                {selectedAddress.slice(-5)}
              </span>
            </button>
            <button
              onClick={handleClear}
              className='shrink-0 text-text-sm text-grayTextPrimary hover:text-text'
            >
              {t("wallet.payment.clear", "Clear")}
            </button>
          </div>
          <Link
            to='/address/$address'
            params={{ address: selectedAddress }}
            className='flex items-center gap-1 text-text-sm text-primary'
          >
            {t("wallet.payment.addressDetail", "Address detail")}
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className='relative'>
          <TextInput
            inputClassName='h-10'
            value={search}
            onchange={setSearch}
            placeholder={t(
              "wallet.payment.addressPlaceholder",
              "Enter address or resolve from handle",
            )}
            onFocus={() => setLocalFocused(true)}
            onKeyDown={handleKeyDown}
            autoCapitalize='off'
          />
        </div>
      )}

      {localFocused && !selectedAddress && search.length > 0 && (
        <div className='absolute z-50 mt-1 flex w-full flex-col rounded-m border border-border bg-background shadow-lg'>
          {isLoading ? (
            <div className='flex h-[100px] items-center justify-center'>
              <div
                className={`loader h-[30px] w-[30px] border-[3px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"}`}
              ></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className='p-3 text-center text-text-sm text-grayTextPrimary'>
              {search.startsWith("addr") ? (
                <button
                  onClick={() => {
                    onSelectAddress(search.trim());
                    setSearch("");
                    setLocalFocused(false);
                  }}
                  className='text-primary hover:underline'
                >
                  {t("wallet.payment.useThisAddress", "Use this address")}
                </button>
              ) : (
                t("wallet.payment.noAddressesFound", "No addresses found")
              )}
            </div>
          ) : (
            <div className='thin-scrollbar max-h-[300px] overflow-auto'>
              {searchResults.map((item, index) => {
                const address = item.ident || item.url?.split("/").pop() || "";
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(item)}
                    className='flex w-full items-center border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-darker'
                  >
                    <div className='flex min-w-0 text-text-sm font-medium'>
                      <span className='truncate'>{address.slice(0, -5)}</span>
                      <span className='shrink-0 text-primary'>
                        {address.slice(-5)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
