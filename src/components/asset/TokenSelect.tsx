import { ChevronsUpDown } from "lucide-react";
import { useEffect, memo, useRef, useState, useMemo } from "react";
import { FixedSizeList as List } from "react-window";

import { Button } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import type { AddressAsset } from "@/types/addressTypes";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import {
  formatNumber,
  formatNumberWithSuffix,
} from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import AssetCell from "./AssetCell";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";

const Row = memo(({ index, style, data }: any) => {
  const item = data[index];
  return (
    <div style={style}>
      <div className='hover:bg-accent flex cursor-pointer items-center justify-between overflow-x-hidden px-2 py-1'>
        <AssetCell
          name={item.name}
          imageSize={30}
          isNft={item.quantity === 1}
          asset={{
            name: item.name,
            quantity: item.quantity,
          }}
        />
        <Tooltip content={formatNumber(item.quantity)}>
          <span className='text-text-xs'>
            {formatNumberWithSuffix(item.quantity)}
          </span>
        </Tooltip>
      </div>
    </div>
  );
});

export const TokenSelectCombobox = memo(
  ({ items, className }: { items: AddressAsset[]; className?: string }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const filteredItems = useMemo(() => {
      return items
        .filter(
          item =>
            item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            getAssetFingerprint(item.name).includes(
              debouncedSearch.toLowerCase(),
            ) ||
            encodeAssetName(item.name)
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase()),
        )
        .sort((a, b) => {
          const calculateValue = (item: AddressAsset) => {
            const decimals = item?.registry?.decimals ?? 0;
            const quantity = item?.quantity ?? 0;
            const price = item?.market?.price ?? 0;

            if (!price) return 0;

            const adjustedQuantity = quantity / Math.pow(10, decimals);
            return adjustedQuantity * price;
          };

          const valueA = calculateValue(a);
          const valueB = calculateValue(b);

          return valueB - valueA;
        });
    }, [debouncedSearch, items]);

    const filteredItemsLength = filteredItems.length;

    const handleWheel = (event: Event) => {
      if (
        contentRef.current &&
        contentRef.current.contains(event.target as Node) &&
        filteredItemsLength < 7
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      if (open) {
        document.body.addEventListener("wheel", handleWheel, {
          passive: false,
          signal,
        });
        document.body.addEventListener("touchmove", handleWheel, {
          passive: false,
          signal,
        });
      } else {
        controller.abort();
      }

      return () => {
        controller.abort();
      };
    }, [open, filteredItemsLength]);

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

    if (items.length === 0) {
      return null;
    }

    return (
      <div className='relative max-w-fit' ref={buttonRef}>
        <Button
          variant='tertiary'
          size='md'
          className={`flex w-[200px] items-center justify-between ${className || ""}`}
          onClick={() => setOpen(!open)}
          label={
            <div className='flex items-center gap-1'>
              <span>Browse tokens</span>
              <span className='text-text-xs'>({items.length})</span>
              <ChevronsUpDown className='ml-1 h-4 w-4 shrink-0 opacity-50' />
            </div>
          }
        />
        {open && (
          <div
            ref={contentRef}
            className='rounded-md text-popover-foreground absolute z-50 w-[300px] overflow-x-hidden rounded-m border border-border bg-background p-0 shadow-md outline-none'
          >
            <div className='overflow-x-hidden'>
              <TextInput
                value={search}
                onchange={value => setSearch(value)}
                placeholder='Search token...'
                wrapperClassName='px-1 py-1'
              />
              <div className='overflow-hidden'>
                {filteredItems.length === 0 ? (
                  <div className='text-sm py-6 text-center'>
                    No token found.
                  </div>
                ) : (
                  <List
                    height={290}
                    itemCount={filteredItems.length}
                    itemSize={50}
                    width='100%'
                    itemData={filteredItems}
                    className='overflow-x-hidden overscroll-contain scroll-smooth'
                    overscanCount={40}
                  >
                    {Row}
                  </List>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
