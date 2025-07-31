import type { FC } from "react";
import { ChevronDown } from "lucide-react";

import Dropdown from "../global/dropdowns/Dropdown";

import { useGlobalSearch } from "@/context/GlobalSearchContext";

interface GlobalSearchDropdownProps {
  isHomepage?: boolean;
}

export const GlobalSearchDropdown: FC<GlobalSearchDropdownProps> = ({ isHomepage }) => {
  const { searchCategory, setSearchCategory } = useGlobalSearch();

  return (
    <div className={isHomepage ? 'flex-shrink-0 ml-2' : 'absolute flex h-full w-[100px] cursor-pointer items-center justify-center border-r border-border px-1'}>
      <Dropdown
        label={
          <div className="flex items-center gap-1">
            <span>{
              searchCategory.includes("_")
                ? searchCategory.split("_")[0][0].toUpperCase() +
                  searchCategory.split("_")[0].slice(1)
                : searchCategory[0].toUpperCase() + searchCategory.slice(1)
            }</span>
            {isHomepage && <ChevronDown size={14} />}
          </div>
        }
        id='1'
        closeOnSelect
        hideChevron={isHomepage}
        wrapperClassname='z-[26]'
        poppoverClassname={`z-[26] ${isHomepage ? 'left-0' : 'left-[0.5px] top-[37.5px] rounded-t-none border-t-0 max-w-[100px]'}`}
        withBorder
        {...(isHomepage && { forceVerticalPosition: "up" })}
        triggerClassName={`text-sm ${isHomepage ? 'text-grayTextSecondary bg-cardBg border border-border h-8 px-2 rounded-lg hover:bg-grayHover transition-colors flex items-center gap-1 whitespace-nowrap' : 'text-grayTextPrimary w-[100px] h-[35px] px-2.5'}`}
        options={[
          {
            label: "All",
            onClick: () => setSearchCategory("all"),
          },
          {
            label: "Tx",
            onClick: () => setSearchCategory("tx"),
          },
          {
            label: "Block",
            onClick: () => setSearchCategory("block"),
          },
          {
            label: "Pool",
            onClick: () => setSearchCategory("pool"),
          },
          {
            label: "Asset",
            onClick: () => setSearchCategory("asset"),
          },
          {
            label: "Policy",
            onClick: () => setSearchCategory("policy"),
          },
          {
            label: "Address",
            onClick: () => setSearchCategory("address"),
          },
          {
            label: "Stake",
            onClick: () => setSearchCategory("stake"),
          },
          {
            label: "Adahandle",
            onClick: () => setSearchCategory("adahandle"),
          },
          {
            label: "User",
            onClick: () => setSearchCategory("user"),
          },
          {
            label: "Article",
            onClick: () => setSearchCategory("article"),
          },
          {
            label: "Page",
            onClick: () => setSearchCategory("page"),
          },
          {
            label: "Gov",
            onClick: () => setSearchCategory("gov_action_proposal"),
          },
        ]}
      />
    </div>
  );
};
