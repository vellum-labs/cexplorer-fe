import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vellumlabs/cexplorer-sdk";
import { currencies } from "@vellumlabs/cexplorer-sdk";
import { locales } from "@/constants/locales";
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import type { NavigationOptions } from "@/types/navigationTypes";
import type { Locales } from "@/types/storeTypes";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Moon,
  Settings,
  Sun,
  SlidersHorizontal,
} from "lucide-react";
import { Dropdown, useDropdownState } from "@vellumlabs/cexplorer-sdk";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useEffect, useRef, useState } from "react";
import { Command } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { useGeekConfigModalState } from "@/stores/states/geekConfigModalState";

interface SettingsDropdownProps {
  withBorder?: boolean;
}

const SettingsDropdown = ({ withBorder = false }: SettingsDropdownProps) => {
  const { theme, toggleTheme } = useThemeStore();
  const { t, locale, changeLanguage } = useAppTranslation();
  const { currency, setCurrency } = useCurrencyStore();
  const {
    infiniteScrolling,
    toggleInfiniteScrolling: toggleInfiniteScrolling,
  } = useInfiniteScrollingStore();
  const { setIsOpen: setGeekConfigOpen } = useGeekConfigModalState();
  const { setOpenId } = useDropdownState();

  const settingsChannel = new BroadcastChannel("settings_channel");

  const [openCurrency, setOpenCurrency] = useState<boolean>(false);
  const [currencySearch, setCurrencySearch] = useState<string>("");

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<any>(null);

  useEffect(() => {
    const handleMessage = event => {
      const { type, payload } = event.data;
      switch (type) {
        case "CURRENCY_CHANGED":
          setCurrency(payload.currency);
          break;
        default:
          break;
      }
    };

    settingsChannel.addEventListener("message", handleMessage);

    return () => {
      settingsChannel.removeEventListener("message", handleMessage);
    };
  }, [setCurrency]);

  useEffect(() => {
    if (currency) {
      settingsChannel.postMessage({
        type: "CURRENCY_CHANGED",
        payload: { currency },
      });
    }
  }, [currency]);

  const startScrolling = direction => {
    stopScrolling();
    scrollIntervalRef.current = setInterval(() => {
      if (contentRef.current) {
        contentRef.current.scrollBy({
          top: direction === "up" ? -5 : 5,
        });
      }
    }, 0);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!openCurrency) {
      stopScrolling();
    }
  }, [openCurrency]);

  const handleCurrency = (value: any) => {
    setCurrency(value);
    settingsChannel.postMessage({
      type: "CURRENCY_CHANGED",
    });
    setOpenCurrency(false);
    setTimeout(() => setCurrencySearch(""), 100);
  };

  const themeIcon = theme === "light" ? <Moon size={20} /> : <Sun size={20} />;

  const settingsOptions: NavigationOptions = [
    {
      label: (
        <button className='flex w-full justify-between'>
          <span>{t("settings.theme")}</span>
          {themeIcon}
        </button>
      ),
      onClick: toggleTheme,
    },
    {
      label: (
        <div
          onMouseDown={e => e.stopPropagation()}
          className='flex items-center justify-between gap-1.5'
        >
          <span>{t("settings.language")}</span>
          <Select
            defaultValue={locale}
            onValueChange={(value: Locales) => {
              changeLanguage(value);
            }}
          >
            <SelectTrigger className='w-[95px]'>
              <SelectValue
                placeholder={
                  <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                    <span>{locales[locale].displayValue}</span>
                    <img
                      width={15}
                      height={15}
                      alt='flag'
                      src={locales[locale].image}
                    />
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent align='end'>
              {Object.entries(locales).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                    <span>{value.displayValue}</span>
                    <img width={15} height={15} alt='flag' src={value.image} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
      onClick: () => {},
    },
    {
      label: (
        <div
          onMouseDown={e => e.stopPropagation()}
          className='flex items-center justify-between gap-1.5'
        >
          <span>{t("settings.currency")}</span>
          <Select
            onValueChange={value => {
              if (value) {
                handleCurrency(value);
              }
            }}
          >
            <SelectTrigger className='w-[95px]'>
              <SelectValue
                placeholder={
                  <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                    <span>{currency.toUpperCase()}</span>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent className='relative w-[100px] border-0 !p-0'>
              <Command className='fixed top-0 z-[110] h-[40px]'>
                <TextInput
                  value={currencySearch}
                  onchange={value => setCurrencySearch(value)}
                  placeholder={t("actions.search")}
                  className='rounded-none border-none outline-none'
                  inputClassName='border-none outline-none'
                />
              </Command>
              <div
                ref={contentRef}
                className='hide-scrollbar relative z-[100] max-h-[370px] w-[100px] overflow-auto overscroll-contain bg-background pt-7 text-text'
              >
                <div
                  className='fixed top-10 z-50 flex h-5 w-full items-center justify-center border-t border-border bg-background'
                  onMouseEnter={() => startScrolling("up")}
                  onMouseLeave={stopScrolling}
                >
                  <ChevronUp size={15} className='h-full' />
                </div>
                <div className='flex w-full flex-col px-1/2 pb-[20px] pt-[10px]'>
                  {Object.entries(currencies)
                    .filter(([, value]) =>
                      (value as any).value
                        .trim()
                        .toLowerCase()
                        .includes(currencySearch.trim().toLowerCase()),
                    )
                    .map(([key, value]) => {
                      return (
                        <div
                          className={`flex w-full cursor-pointer select-none flex-nowrap items-center rounded-xs px-1 py-0.5 ${key === currency ? "bg-cardBg" : ""}`}
                        >
                          <SelectItem
                            key={key}
                            className={`text-text-sm`}
                            value={(value as any).value.toLowerCase()}
                          >
                            <span>{(value as any).value.toUpperCase()}</span>
                          </SelectItem>
                        </div>
                      );
                    })}
                </div>
                <div
                  className='fixed bottom-[-2px] left-0 z-50 flex h-6 w-full items-center justify-center bg-background'
                  onMouseEnter={() => startScrolling("down")}
                  onMouseLeave={stopScrolling}
                >
                  <ChevronDown size={15} className='h-full' />
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>
      ),
      onClick: () => {},
    },
    {
      label: (
        <button className='flex w-full items-center justify-between'>
          <span>{t("settings.infiniteScrolling")}</span>
          <span>{infiniteScrolling && <Check size={20} />}</span>
        </button>
      ),
      onClick: () => {
        toggleInfiniteScrolling();
      },
    },
    {
      label: (
        <button className='flex w-full items-center justify-between'>
          <span>{t("settings.geekConfiguration")}</span>
          <SlidersHorizontal size={18} />
        </button>
      ),
      onClick: () => {
        setOpenId("geekConfigModal");
        setGeekConfigOpen(true);
      },
    },
  ];
  return (
    <Dropdown
      id='navSettings'
      disableHover
      hideChevron
      label={
        <p className='flex gap-1'>
          <Settings />
        </p>
      }
      options={settingsOptions}
      width='200px'
      poppoverClassname={
        withBorder ? "border border-border !p-0 !w-[200px]" : undefined
      }
    />
  );
};

export default SettingsDropdown;
