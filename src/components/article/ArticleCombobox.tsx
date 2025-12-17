import { Check, ChevronsUpDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@vellumlabs/cexplorer-sdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@vellumlabs/cexplorer-sdk";
import { articleCategories } from "@/constants/article";
import { cn } from "@vellumlabs/cexplorer-sdk";
import type { ArticleCategories } from "@/types/articleTypes";

const categoriesOptions = articleCategories.map(category => ({
  value: category,
  label: category,
}));

interface Props {
  categories: ArticleCategories[];
  setCategories: Dispatch<SetStateAction<ArticleCategories[]>>;
  className?: string;
}

export function ArticleCombobox({
  categories: categoriesProp,
  setCategories,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const categories = Array.isArray(categoriesProp) ? categoriesProp : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn("w-full", className)}>
        <div
          role='combobox'
          aria-expanded={open}
          className='flex h-[34px] w-full cursor-pointer items-center justify-between rounded-m border border-border bg-background px-2 text-text-sm text-text hover:bg-cardBg'
        >
          <span className='truncate'>
            {categories.length > 0
              ? categoriesOptions
                  .filter(category =>
                    categories?.find(c => c === category.value),
                  )
                  .map(category => category.label)
                  .join(", ")
              : "Select categories"}
          </span>
          <ChevronsUpDown className='ml-1 h-4 w-4 shrink-0 opacity-50' />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search categories...' />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoriesOptions.map(category => {
                const isSelected = categories.includes(
                  category.value as ArticleCategories,
                );
                return (
                  <CommandItem
                    key={category.value}
                    value={category.value}
                    onSelect={() => {
                      if (isSelected) {
                        setCategories(
                          categories.filter(c => c !== category.value),
                        );
                      } else {
                        setCategories([
                          ...categories,
                          category.value as ArticleCategories,
                        ]);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-1 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {category.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
