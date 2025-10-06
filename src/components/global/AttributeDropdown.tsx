import type { ReactNode } from "react";
import type { FC } from "react";

import { FixedSizeList as List } from "react-window";
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

import { memo, useRef, useState } from "react";

const Row = memo(({ index, style, data }: any) => {
  const { label, value } = data[index];

  return (
    <div style={style}>
      <CommandItem
        className='cursor-default bg-transparent hover:bg-transparent'
        disableHover
      >
        <div className='flex w-full items-center justify-between gap-1.5 text-xs text-text'>
          <div>{label}</div>
          <div>{value}</div>
        </div>
      </CommandItem>
    </div>
  );
});

interface AttributeDropdownProps {
  items: {
    label: ReactNode;
    value: ReactNode;
    visible?: boolean;
  }[];
  children: ReactNode;
  className?: string;
  itemSize?: number;
}

export const AttributeDropdown: FC<AttributeDropdownProps> = ({
  items,
  children,
  className,
  itemSize,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    item => typeof item.visible === "undefined" || item.visible,
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          ref={contentRef}
          className={`w-[220px] p-0 ${className ? className : ""}`}
        >
          <Command>
            <CommandList className='overflow-hidden'>
              <CommandEmpty>No attribute found.</CommandEmpty>
              <CommandGroup>
                <List
                  height={(itemSize ?? 30) * filteredItems.length + 10}
                  itemCount={filteredItems.length}
                  itemSize={itemSize ?? 30}
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
};
