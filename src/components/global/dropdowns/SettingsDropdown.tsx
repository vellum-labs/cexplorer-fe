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
import { useThemeStore } from "@/stores/themeStore";
import type { NavigationOptions } from "@/types/navigationTypes";
import type { Locales } from "@/types/storeTypes";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { Dropdown } from "@vellumlabs/cexplorer-sdk";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@vellumlabs/cexplorer-sdk";
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

  const startScrolling = direction => {
    stopScrolling();
    scrollIntervalRef.current = setInterval(() => {
      if (contentRef.current) {
        contentRef.current.scrollBy({
          top: direction === "up" ? -5 : 5,
          // behavior: "smooth",
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
            <SelectTrigger className='w-[90px]'>
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
          <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
            <PopoverTrigger asChild>
              <Button
                variant='tertiary'
                size='md'
                aria-expanded={openCurrency}
                className='flex w-[95px] items-center justify-between'
                label={
                  <>
                    <span className='text-text-xs'>
                      {currencies[currency].value.toUpperCase()}
                    </span>
                    <ChevronsUpDown className='ml-1 h-4 w-4 shrink-0 opacity-50' />
                  </>
                }
              />
            </PopoverTrigger>
            <PopoverContent className='w-[95px] border-b-0 p-0'>
              <Command className=''>
                <TextInput
                  value={currencySearch}
                  onchange={value => setCurrencySearch(value)}
                  placeholder='Search'
                  wrapperClassName=' mb-1'
                  className='rounded-none'
                  inputClassName='border-none outline-none'
                />
              </Command>
              <div
                ref={contentRef}
                className='relative z-[9999] min-w-[90px] overflow-auto overscroll-contain bg-background text-text'
              >
                <div
                  className='fixed left-0 top-[40px] z-50 flex h-5 w-full items-center justify-center border-x border-t border-border bg-background'
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
                          key={key}
                          className={`flex w-full cursor-pointer select-none items-center justify-between rounded-xs px-2 py-1.5 text-text-sm hover:bg-cardBg ${key === currency ? "bg-cardBg" : ""}`}
                          onClick={() => {
                            if (value) {
                              handleCurrency((value as any).value);
                            }
                          }}
                        >
                          <span>{(value as any).value.toUpperCase()}</span>
                          {key === currency && <Check size={15} />}
                        </div>
                      );
                    })}
                </div>
                <div
                  className='ove fixed bottom-[-2px] left-0 z-50 flex h-6 w-full items-center justify-center rounded-b-m border-x border-b border-border bg-background'
                  onMouseEnter={() => startScrolling("down")}
                  onMouseLeave={stopScrolling}
                >
                  <ChevronDown size={15} className='h-full' />
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
