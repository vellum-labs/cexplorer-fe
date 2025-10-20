import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/constants/currencies";
import { locales } from "@/constants/locales";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useLocaleStore } from "@/stores/localeStore";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import type { NavigationOptions } from "@/types/navigationTypes";
import type { Locales } from "@/types/storeTypes";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { Dropdown } from "@vellumlabs/cexplorer-sdk";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useEffect, useRef, useState } from "react";
import { Command } from "@/components/ui/command";
import { TextInput } from "@vellumlabs/cexplorer-sdk";

interface SettingsDropdownProps {
  withBorder?: boolean;
}

const SettingsDropdown = ({ withBorder = false }: SettingsDropdownProps) => {
  const { theme, toggleTheme } = useThemeStore();
  const { locale, setLocale } = useLocaleStore();
  const { currency, setCurrency } = useCurrencyStore();
  const {
    infiniteScrolling,
    toggleInfiniteScrolling: toggleInfiniteScrolling,
  } = useInfiniteScrollingStore();

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
  console.log("🚀 ~ SettingsDropdown ~ currency:", currency);

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
          <span>Theme</span>
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
          <span>Language</span>
          <Select
            defaultValue={locale}
            onValueChange={(value: Locales) => {
              setLocale(value);
            }}
          >
            <SelectTrigger className='w-[95px]'>
              <SelectValue
                placeholder={
                  <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                    <span>{locales[locale].value}</span>
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
                    <span>{value.value}</span>
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
          <span>Currency</span>
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
                className='justify-end text-nowrap'
              />
            </SelectTrigger>
            <SelectContent
              padding={false}
              className='relative w-[90px] border-0 !p-0'
            >
              <Command className='fixed top-0 z-[110] h-[40px]'>
                <TextInput
                  value={currencySearch}
                  onchange={value => setCurrencySearch(value)}
                  placeholder='Search'
                  className='rounded-none border-none outline-none'
                  inputClassName='border-none outline-none'
                />
              </Command>
              <div
                ref={contentRef}
                className='hide-scrollbar relative z-[100] max-h-[370px] w-[90px] overflow-auto overscroll-contain bg-background pt-7 text-text'
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
                        <SelectItem
                          key={key}
                          className={`flex w-full cursor-pointer select-none items-center justify-between rounded-xs px-2 py-1.5 text-text-sm hover:bg-cardBg ${key === currency ? "bg-cardBg" : ""}`}
                          value={(value as any).value.toUpperCase()}
                        >
                          <span>{(value as any).value.toUpperCase()}</span>
                          {key === currency && <Check size={15} />}
                        </SelectItem>
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
          <span>Infinite scrolling</span>
          <span>{infiniteScrolling && <Check size={20} />}</span>
        </button>
      ),
      onClick: () => {
        toggleInfiniteScrolling();
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
      poppoverClassname={withBorder ? "border border-border" : undefined}
    />
  );
};

export default SettingsDropdown;
