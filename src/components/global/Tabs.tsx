import type { TabItem } from "@/types/commonTypes";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { MobileTabsSelector } from "./MobileTabsSelector";

interface Props {
  items: (TabItem | undefined)[];
  withPadding?: boolean;
  withMargin?: boolean;
  activeTabValue?: string;
  tabParam?: string;
  onClick?: (activeTab: string) => void;
  toRight?: boolean;
  extraContent?: ReactNode;
  forceDropdownVerticalPosition?: "up" | "down";
  mobileItemsCount?: number;
  wrapperClassname?: string;
  allowScroll?: boolean;
  apiLoading?: boolean;
}

const Tabs = ({
  items: initialItems,
  withPadding = true,
  withMargin = true,
  toRight = false,
  activeTabValue = "",
  tabParam = "",
  apiLoading = false,
  forceDropdownVerticalPosition,
  onClick,
  mobileItemsCount,
  wrapperClassname,
  allowScroll = false,
}: Props) => {
  const [tabTitle, setTabTitle] = useState("");
  const items = useMemo(
    () =>
      initialItems.filter(
        (item): item is TabItem => item !== undefined && item.visible,
      ),
    [initialItems],
  );
  const { tab, ...rest } = useSearch({ strict: false });

  const initialActiveTab = useMemo(() => {
    const activeIntialTab = initialItems.findIndex(item => item?.key === tab);

    return activeIntialTab !== -1 ? activeIntialTab : 0;
  }, []);

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  useEffect(() => {
    if (
      document?.title === "Cardano Explorer" ||
      document?.title.startsWith("Cexplorer.io")
    )
      return;
    setTabTitle(
      `${document.title.includes("-") ? document.title.replace(/ - [^-]*$/, "") : document.title.replace(" | Cexplorer.io", "")} - ${items[activeTab]?.title || String(items[activeTab]?.label)} | Cexplorer.io`,
    );
  }, [activeTab, items]);

  const navigate = useNavigate();

  const mobileItems = mobileItemsCount ? mobileItemsCount : 2;

  const navigationOptions = (index: number) => {
    const allowedKeys = ["tab"];

    const baseSearch = Object.fromEntries(
      Object.entries({ tab, ...rest }).filter(([key]) =>
        allowedKeys.includes(key),
      ),
    );

    const keyToUse = tabParam || "tab";

    return {
      ...baseSearch,
      [keyToUse]: items[index]?.key,
    };
  };

  const handleTabChange = (index: number) => {
    if (onClick && items[index]?.key) {
      onClick(items[index].key);
    }

    navigate({
      search: navigationOptions(index) as any,
    });
  };

  const tabOptions = items.map((item, index) => ({
    label: (
      <span className={activeTab === index ? "text-primary" : ""}>
        {item.label}
      </span>
    ),
    onClick: () => handleTabChange(index),
  }));

  useLayoutEffect(() => {
    if (apiLoading) {
      return;
    }

    let desiredKey = activeTabValue;
    if (!desiredKey) {
      if (tabParam && rest[tabParam]) {
        desiredKey = rest[tabParam];
      } else {
        desiredKey = tab as string;
      }
    }
    const index = items.findIndex(item => item.key === desiredKey);
    if (index !== -1 && index !== activeTab) {
      setActiveTab(index);
      if (onClick) {
        onClick(items[index].key);
      }
    }
  }, [activeTabValue, rest, tab, apiLoading, items, tabParam]);

  const activeContent = useMemo(() => {
    const content = items[activeTab]?.content;
    return typeof content === "function" ? content() : content;
  }, [items, activeTab]);

  return (
    !apiLoading && (
      <section
        aria-label='Tab Navigation'
        className={`${withMargin ? "my-3" : ""} ${
          toRight ? "items-end" : ""
        } flex w-full max-w-desktop flex-col ${
          withPadding ? "px-mobile md:px-desktop" : ""
        } ${wrapperClassname ? wrapperClassname : ""}`}
      >
        <div
          className={`flex ${tabParam ? "h-[35px]" : "h-[44px]"} w-full justify-between lg:hidden`}
        >
          {items[activeTab]?.extraTitle && toRight
            ? items[activeTab]?.extraTitle
            : ""}
          <MobileTabsSelector
            items={items}
            mobileItems={mobileItems}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            tabOptions={tabOptions}
            forceDropdownVerticalPosition={forceDropdownVerticalPosition}
            withMargin={withMargin}
            secondary={!!tabParam}
          />
        </div>
        <div
          role='tablist'
          className={`${withMargin ? "mb-3" : ""} flex w-full items-center gap-1 ${
            toRight ? "justify-end" : ""
          }`}
        >
          {items[activeTab]?.extraTitle && toRight ? (
            <p className='hidden w-full lg:block'>
              {items[activeTab]?.extraTitle}
            </p>
          ) : (
            ""
          )}
          {allowScroll ? (
            <div className='thin-scrollbar hidden w-full overflow-x-auto overflow-y-hidden lg:block'>
              <div
                className={`flex ${tabParam ? "h-[35px]" : "h-[44px]"} mx-1/2 w-fit items-center gap-1/4 text-nowrap rounded-m border border-borderFaded bg-darker font-medium shadow`}
              >
                {items.map((item, index) => (
                  // @ts-expect-error link
                  <Link
                    key={index}
                    className={`flex items-center rounded-m border px-1.5 py-1 ${
                      tabParam
                        ? "h-[35px] text-sm font-semibold"
                        : "h-[44px] text-text-md font-semibold"
                    } ${
                      activeTab === index
                        ? `z-20 border-border bg-background ${
                            tabParam
                              ? "text-text hover:text-text"
                              : "text-primary hover:text-primary"
                          }`
                        : "border-transparent text-grayTextPrimary duration-150 hover:text-text"
                    } ${index === 0 ? "-ml-px" : ""} ${index === items.length - 1 ? "-mr-px" : ""}`}
                    onClick={() => handleTabChange(index)}
                    role='tab'
                    aria-selected={activeTab === index}
                    aria-controls={`panel-${index}`}
                    id={`tab-${index}`}
                    search={navigationOptions(index) as any}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`hidden ${tabParam ? "h-[35px]" : "h-[44px]"} w-fit items-center gap-1/4 text-nowrap rounded-m border border-borderFaded bg-darker font-medium shadow-md lg:flex`}
            >
              {items.map((item, index) => (
                // @ts-expect-error link
                <Link
                  key={index}
                  className={`flex items-center rounded-m border px-1.5 py-1 ${
                    tabParam
                      ? "h-[35px] text-sm font-semibold"
                      : "h-[44px] text-text-md font-semibold"
                  } ${
                    activeTab === index
                      ? `z-20 border-border bg-background ${
                          tabParam
                            ? "text-text hover:text-text"
                            : "text-primary hover:text-primary"
                        }`
                      : "border-transparent text-grayTextPrimary duration-150 hover:text-text"
                  } ${index === 0 ? "-ml-px" : ""} ${index === items.length - 1 ? "-mr-px" : ""}`}
                  onClick={() => handleTabChange(index)}
                  role='tab'
                  aria-selected={activeTab === index}
                  aria-controls={`panel-${index}`}
                  id={`tab-${index}`}
                  search={navigationOptions(index) as any}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
          {items[activeTab]?.extraTitle && !toRight
            ? items[activeTab]?.extraTitle
            : ""}
        </div>
        {items[activeTab]?.content && (
          <div
            role='tabpanel'
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            aria-live='polite'
            className='w-full'
          >
            {tabTitle && (
              <Helmet>
                {/* <title> */}
                {/* {document.title.replace(" | Cexplorer.io", "")} */}
                {/* -{" "}
              {items[activeTab].title || String(items[activeTab].label)} |
              Cexplorer.io */}
                {/* </title> */}
                <title>{tabTitle}</title>
              </Helmet>
            )}
            {activeContent}
          </div>
        )}
      </section>
    )
  );
};

export default Tabs;
