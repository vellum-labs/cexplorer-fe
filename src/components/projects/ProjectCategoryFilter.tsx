import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { capitalize } from "@/utils/projectHelpers";

interface ProjectCategoryFilterProps {
  categories: string[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}

export const ProjectCategoryFilter: FC<ProjectCategoryFilterProps> = ({
  categories,
  selected,
  setSelected,
}) => {
  const { t } = useAppTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const filteredCategories = search
    ? categories.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : categories;

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

  return (
    <div className='relative' ref={buttonRef}>
      <div
        role='combobox'
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className='flex min-h-[40px] w-fit cursor-pointer items-center gap-1 rounded-m border border-border bg-background px-2 text-text-sm text-text hover:bg-cardBg'
      >
        <span className='truncate'>
          {selected.length > 0
            ? selected.map(capitalize).join(", ")
            : t("projects.page.allCategories")}
        </span>
        <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
      </div>
      {open && (
        <div
          ref={contentRef}
          className='absolute z-50 mt-1 w-[220px] overflow-hidden rounded-m border border-border bg-background shadow-md'
        >
          <TextInput
            value={search}
            onchange={setSearch}
            placeholder={t("projects.page.searchCategories")}
            wrapperClassName='px-1 py-1'
          />
          <div className='max-h-[200px] overflow-y-auto'>
            {filteredCategories.length === 0 ? (
              <div className='py-3 text-center text-text-sm text-grayTextPrimary'>
                {t("projects.page.noCategoryFound")}
              </div>
            ) : (
              filteredCategories.map(category => {
                const isSelected = selected.includes(category);
                return (
                  <div
                    key={category}
                    onClick={() => {
                      if (isSelected) {
                        setSelected(selected.filter(c => c !== category));
                      } else {
                        setSelected([...selected, category]);
                      }
                    }}
                    className='flex cursor-pointer items-center gap-1 px-2 py-1 text-text-sm hover:bg-cardBg'
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary opacity-100" : "opacity-0"}`}
                    />
                    {capitalize(category)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
