import { colors } from "@/constants/colors";
import type { TabItem } from "@/types/commonTypes";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Dropdown from "./dropdowns/Dropdown";

interface Props {
  items: TabItem[];
  mobileItems: number;
  withMargin?: boolean;
  handleTabChange: (index: number) => void;
  activeTab: number;
  tabOptions: { label: ReactNode; onClick: () => void }[];
  forceDropdownVerticalPosition?: "up" | "down";
  secondary: boolean;
}

export const MobileTabsSelector = ({
  withMargin,
  mobileItems,
  items,
  handleTabChange,
  activeTab,
  tabOptions,
  forceDropdownVerticalPosition,
  secondary,
}: Props) => {
  const { width } = useWindowDimensions();

  const [visibleItems, setVisibleItems] = useState<number>(mobileItems);

  useEffect(() => {
    switch (true) {
      case width < 500:
        setVisibleItems(mobileItems || 2);
        break;
      case width < 600:
        setVisibleItems(mobileItems || 3);
        break;
      case width < 650:
        setVisibleItems(4);
        break;
      case width < 780:
        setVisibleItems(5);
        break;
      case width > 780:
        setVisibleItems(items.length);
        break;

      default:
        setVisibleItems(mobileItems);
        break;
    }
  }, [width, mobileItems, items.length]);
  return (
    <div
      className={`${withMargin ? "mb-5" : ""} flex items-center ${secondary ? "h-[32px]" : "h-[40px]"} w-fit rounded-lg border border-border bg-darker`}
    >
      {items?.slice(0, visibleItems).map((item, index) => (
        <button
          role='tab'
          aria-selected={activeTab === index}
          aria-controls={`panel-${index}`}
          id={`tab-${index}`}
          className={`flex items-center px-2.5 py-2 ${secondary ? "h-[32px] text-grayTextPrimary" : "h-[40px]"} text-[13px] font-semibold duration-150 hover:text-secondaryText min-[1050px]:text-[15px] ${activeTab === index && `relative rounded-lg bg-background ${secondary ? "text-text" : "text-primary"} after:absolute after:left-0 after:top-0 after:h-[calc(100%+1px)] after:w-full after:translate-y-[-0.5px] after:rounded-lg after:border after:border-border after:first:border-l-0 after:last:border-r-0`} first:rounded-l-lg last:rounded-r-lg`}
          key={index}
          onClick={() => handleTabChange(index)}
        >
          <div>{item.label}</div>
        </button>
      ))}
      {visibleItems < items.length && (
        <Dropdown
          id={items[activeTab]?.key}
          width='150px'
          label={
            <ChevronDown
              color={activeTab > 1 ? colors.primary : colors.text}
              size={20}
            />
          }
          hideChevron
          options={tabOptions.slice(visibleItems)}
          triggerClassName={`text-primary font-medium  rounded-r-lg px-3 py-1.5 ${activeTab >= visibleItems ? "bg-background" : "bg-darker"}`}
          forceVerticalPosition={forceDropdownVerticalPosition}
          closeOnSelect
        />
      )}
    </div>
  );
};
