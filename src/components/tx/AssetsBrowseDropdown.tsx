import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { encodeAssetName, getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import type { TxAsset } from "@/types/assetsTypes";
import AssetLink from "@/components/asset/AssetLink";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AssetsBrowseDropdownProps {
  assets: TxAsset[];
  type: "input" | "output";
}

export const AssetsBrowseDropdown = memo(
  ({ assets, type }: AssetsBrowseDropdownProps) => {
    const { t } = useAppTranslation("common");
    const contentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const filteredAssets = useMemo(() => {
      if (!debouncedSearch) return assets;

      const searchLower = debouncedSearch.toLowerCase();
      return assets.filter(asset => {
        if (asset.name.toLowerCase().includes(searchLower)) return true;
        const encoded = encodeAssetName(asset.name);
        if (encoded.toLowerCase().includes(searchLower)) return true;
        return getAssetFingerprint(asset.name).includes(searchLower);
      });
    }, [debouncedSearch, assets]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (!open) setSearch("");
    }, [open]);

    if (assets.length === 0) {
      return null;
    }

    return (
      <div className='relative max-w-fit' ref={buttonRef}>
        <Button
          variant='tertiary'
          size='sm'
          className='flex items-center justify-between text-nowrap'
          onClick={() => setOpen(!open)}
          label={
            <div className='flex items-center gap-1'>
              <span>{t("tx.columns.assets")}</span>
              <span className='text-text-xs'>({assets.length})</span>
              <ChevronsUpDown className='ml-0.5 h-3.5 w-3.5 shrink-0 opacity-50' />
            </div>
          }
        />
        {open && (
          <div
            ref={contentRef}
            className='absolute right-0 z-50 mt-0.5 w-[280px] rounded-m border border-border bg-background shadow-md'
          >
            <TextInput
              value={search}
              onchange={value => setSearch(value)}
              placeholder={t("policy.searchByAsset")}
              wrapperClassName='px-1 py-1'
            />
            <div className='max-h-[260px] overflow-y-auto p-1 pt-0'>
              {filteredAssets.length === 0 ? (
                <div className='py-4 text-center text-text-xs text-grayTextPrimary'>
                  {t("asset.noTokenFound")}
                </div>
              ) : (
                <div className='flex flex-col gap-0.5'>
                  {filteredAssets.map((asset, i) => (
                    <AssetLink
                      key={`${asset.name}-${i}`}
                      type={type}
                      asset={asset}
                      className='min-w-0 max-w-full'
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
