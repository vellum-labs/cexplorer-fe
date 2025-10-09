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
      className={`${withMargin ? "mb-3" : ""} flex items-center ${secondary ? "h-[32px]" : "h-[40px]"} w-fit rounded-m border border-borderFaded bg-darker gap-0.5`}
    >
      {items?.slice(0, visibleItems).map((item, index) => (
        <button
          role='tab'
          aria-selected={activeTab === index}
          aria-controls={`panel-${index}`}
          id={`tab-${index}`}
          className={`flex items-center px-1.5 py-1 border rounded-m ${secondary ? "h-[32px]" : "h-[40px]"} text-[13px] font-semibold min-[1050px]:text-[15px] ${activeTab === index ? `bg-background z-20 border-border ${secondary ? "text-text hover:text-text" : "text-primary hover:text-primary"}` : "border-transparent text-grayTextPrimary duration-150 hover:text-text"} ${index === 0 ? "-ml-px" : ""} ${index === visibleItems - 1 ? "-mr-px" : ""}`}
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
          triggerClassName={`text-primary font-medium  rounded-r-m px-1.5 py-1 ${activeTab >= visibleItems ? "bg-background" : "bg-darker"}`}
          forceVerticalPosition={forceDropdownVerticalPosition}
          closeOnSelect
        />
      )}
    </div>
  );
};
