import type { FC } from "react";
import { useState, useRef } from "react";
import { useGlobalSearch } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useClickOutsideGroup } from "@/hooks/useClickOutsideGroup";
import { Search } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Pool {
  pool_id: string;
  pool_name: {
    ticker: string;
    name: string;
  };
}

interface PoolSelectorProps {
  selectedPool: Pool | null;
  onSelectPool: (pool: Pool | null) => void;
}

export const PoolSelector: FC<PoolSelectorProps> = ({
  selectedPool,
  onSelectPool,
}) => {
  const { t } = useAppTranslation("common");
  const [localFocused, setLocalFocused] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();

  const { search, handleSearchChange, data, isLoading } = useGlobalSearch();

  const poolResults = data.filter(item => item.category === "pool");

  useClickOutsideGroup([searchRef], () => {
    setLocalFocused(false);
    handleSearchChange("");
  });

  const handleSelect = (pool: any) => {
    onSelectPool({
      pool_id: pool.url.split("/").pop() || "",
      pool_name: {
        ticker: pool.title.split(" ")[0] || "",
        name: pool.title,
      },
    });
    handleSearchChange("");
    setLocalFocused(false);
  };

  const handleClear = () => {
    onSelectPool(null);
    handleSearchChange("");
  };

  return (
    <div className='relative w-full' ref={searchRef}>
      {selectedPool ? (
        <div className='flex min-h-[48px] items-center justify-between gap-2 rounded-s border border-border bg-background px-3'>
          <div className='flex min-w-0 items-center gap-2'>
            <Image
              src={generateImageUrl(selectedPool.pool_id || "", "ico", "pool")}
              type='pool'
              height={35}
              width={35}
              className='flex-shrink-0 rounded-max'
            />
            <span className='truncate text-text-sm'>{selectedPool.pool_name.name}</span>
          </div>
          <button
            onClick={handleClear}
            className='text-text-sm text-grayTextPrimary hover:text-text'
          >
            {t("stakingCalculator.poolSelector.clear")}
          </button>
        </div>
      ) : (
        <div className='relative flex items-center'>
          <TextInput
            value={search}
            onchange={handleSearchChange}
            placeholder={t("stakingCalculator.poolSelector.placeholder")}
            onFocus={() => setLocalFocused(true)}
            autoCapitalize='off'
            inputClassName='!bg-transparent'
            wrapperClassName='w-full'
          />
          {!search && (
            <Search
              size={20}
              style={{ color: "var(--grayTextPrimary)" }}
              className='pointer-events-none absolute right-2'
            />
          )}
        </div>
      )}

      {localFocused && !selectedPool && search.length > 0 && (
        <div className='absolute z-50 mt-1 flex w-full flex-col rounded-m border border-border bg-background shadow-lg'>
          {isLoading ? (
            <div className='flex h-[100px] items-center justify-center'>
              <div
                className={`loader h-[30px] w-[30px] border-[3px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"}`}
              ></div>
            </div>
          ) : poolResults.length === 0 ? (
            <div className='p-3 text-center text-text-sm text-grayTextPrimary'>
              {t("stakingCalculator.poolSelector.noPoolsFound")}
            </div>
          ) : (
            <div className='thin-scrollbar max-h-[300px] overflow-auto'>
              {poolResults.map((pool, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(pool)}
                  className='flex w-full flex-col items-start gap-0.5 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-darker'
                >
                  <span className='text-text-sm font-medium'>{pool.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
