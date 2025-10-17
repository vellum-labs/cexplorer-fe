import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { FixedSizeList as List } from "react-window";

import { Button } from "@vellumlabs/cexplorer-sdk";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/useDebounce";
import type { AddressAsset } from "@/types/addressTypes";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { formatNumber } from "@/utils/format/format";
import TextInput from "../global/inputs/TextInput";
import AssetCell from "./AssetCell";

const Row = React.memo(({ index, style, data }: any) => {
  const item = data[index];
  return (
    <div style={style}>
      <CommandItem>
        <AssetCell
          name={item.name}
          imageSize={30}
          isNft={item.quantity === 1}
        />
        <span className='text-text-xs'>{formatNumber(item.quantity)}</span>
      </CommandItem>
    </div>
  );
});

export const TokenSelectCombobox = React.memo(
  ({ items, className }: { items: AddressAsset[]; className?: string }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const debouncedSearch = useDebounce(search);

    const filteredItems = React.useMemo(() => {
      return items.filter(
        item =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          getAssetFingerprint(item.name).includes(
            debouncedSearch.toLowerCase(),
          ) ||
          encodeAssetName(item.name)
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
      );
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

    React.useEffect(() => {
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

    if (items.length === 0) {
      return null;
    }

    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className={className}>
            <Button
              variant='tertiary'
              size='md'
              className='flex w-[200px] items-center justify-between'
              label={
                <>
                  Browse tokens
                  <span className='text-text-xs'>({items.length})</span>
                  <ChevronsUpDown className='ml-1 h-4 w-4 shrink-0 opacity-50' />
                </>
              }
            />
          </PopoverTrigger>
          <PopoverContent ref={contentRef} className='w-[300px] p-0'>
            <Command className=''>
              <TextInput
                value={search}
                onchange={value => setSearch(value)}
                placeholder='Search token...'
                wrapperClassName='px-1 py-1'
              />
              <CommandList className='overflow-hidden'>
                <CommandEmpty>No token found.</CommandEmpty>
                <CommandGroup className=''>
                  <List
                    height={290}
                    itemCount={filteredItems.length}
                    itemSize={50}
                    width='100%'
                    itemData={filteredItems}
                    className='overscroll-contain scroll-smooth'
                    overscanCount={40}
                  >
                    {Row}
                  </List>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </>
    );
  },
);
