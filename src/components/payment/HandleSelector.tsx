import type { FC } from "react";
import { useState, useRef } from "react";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useGlobalSearch } from "@vellumlabs/cexplorer-sdk";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { useClickOutsideGroup } from "@/hooks/useClickOutsideGroup";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

interface HandleData {
  name: string;
  address: string;
}

interface HandleSelectorProps {
  selectedHandle: HandleData | null;
  onSelectHandle: (handle: HandleData | null) => void;
}

export const HandleSelector: FC<HandleSelectorProps> = ({
  selectedHandle,
  onSelectHandle,
}) => {
  const { t } = useAppTranslation("common");
  const [localFocused, setLocalFocused] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();

  const { search, handleSearchChange, data, isLoading } = useGlobalSearch();

  const handleResults = data.filter(item => item.category === "adahandle");

  useClickOutsideGroup([searchRef], () => {
    setLocalFocused(false);
    handleSearchChange("");
  });

  const handleSelect = (handle: any) => {
    const address = handle.url?.split("/").pop() || "";
    onSelectHandle({
      name: handle.title || "",
      address: address,
    });
    handleSearchChange("");
    setLocalFocused(false);
  };

  const handleClear = () => {
    onSelectHandle(null);
    handleSearchChange("");
  };

  return (
    <div className='relative w-full' ref={searchRef}>
      {selectedHandle ? (
        <div className='flex min-h-[40px] items-center justify-between gap-2 rounded-m border border-border bg-background px-3'>
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectedHandle.name);
              toast.success(
                t("wallet.payment.handleCopied", "Handle copied to clipboard"),
              );
            }}
            className='flex min-w-0 cursor-pointer items-center hover:opacity-80'
          >
            <img src={DollarIcon} alt='$' className='h-4 w-4 shrink-0' />
            <span className='truncate text-text-sm font-medium'>
              {selectedHandle.name}
            </span>
          </button>
          <button
            onClick={handleClear}
            className='text-text-sm text-grayTextPrimary hover:text-text'
          >
            {t("wallet.payment.clear", "Clear")}
          </button>
        </div>
      ) : (
        <div className='relative'>
          <TextInput
            inputClassName='h-10'
            value={search}
            onchange={handleSearchChange}
            placeholder={t(
              "wallet.payment.handlePlaceholder",
              "Enter a handle...",
            )}
            onFocus={() => setLocalFocused(true)}
            autoCapitalize='off'
          />
        </div>
      )}

      {localFocused && !selectedHandle && search.length > 0 && (
        <div className='absolute z-50 mt-1 flex w-full flex-col rounded-m border border-border bg-background shadow-lg'>
          {isLoading ? (
            <div className='flex h-[100px] items-center justify-center'>
              <div
                className={`loader h-[30px] w-[30px] border-[3px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"}`}
              ></div>
            </div>
          ) : handleResults.length === 0 ? (
            <div className='p-3 text-center text-text-sm text-grayTextPrimary'>
              {t("wallet.payment.noHandlesFound", "No handles found")}
            </div>
          ) : (
            <div className='thin-scrollbar max-h-[300px] overflow-auto'>
              {handleResults.map((handle, index) => {
                const address = handle.url?.split("/").pop() || "";
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(handle)}
                    className='flex w-full flex-col items-start gap-0.5 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-darker'
                  >
                    <div className='flex items-center gap-1'>
                      <img src={DollarIcon} alt='$' className='h-3.5 w-3.5' />
                      <span className='text-text-sm font-medium'>
                        {handle.title}
                      </span>
                    </div>
                    {address && (
                      <span className='text-text-xs text-grayTextPrimary'>
                        {formatString(address, "long")}
                      </span>
                    )}
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
