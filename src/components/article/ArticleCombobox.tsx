import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { articleCategories } from "@/constants/article";
import { cn } from "@/lib/utils";
import type { ArticleCategories } from "@/types/articleTypes";

const categoriesOptions = articleCategories.map(category => ({
  value: category,
  label: category,
}));

interface Props {
  categories: ArticleCategories[];
  setCategories: React.Dispatch<React.SetStateAction<ArticleCategories[]>>;
  className?: string;
}

export function ArticleCombobox({
  categories,
  setCategories,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between bg-background text-text'
        >
          <span className='block overflow-hidden text-ellipsis'>
            {categories.length > 0
              ? categoriesOptions
                  .filter(category =>
                    categories?.find(c => c === category.value),
                  )
                  .map(category => category.label)
                  .join(", ")
              : "Select categories"}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search categories...' />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoriesOptions.map(category => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={currentValue => {
                    const newCategories = categories;
                    if (
                      newCategories.includes(currentValue as ArticleCategories)
                    ) {
                      newCategories.splice(
                        newCategories.indexOf(
                          currentValue as ArticleCategories,
                        ),
                        1,
                      );
                    } else {
                      newCategories.push(currentValue as ArticleCategories);
                    }
                    setCategories(() => [...newCategories]);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      categories.length > 0 &&
                        categories?.find(c => c === category.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
