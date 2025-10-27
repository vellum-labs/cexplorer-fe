import type { Locales } from "@/types/storeTypes";
import type { FC } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vellumlabs/cexplorer-sdk";

import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";

import { locales } from "@/constants/locales";

export const SettingsMobileItemLanguage: FC = () => {
  const { locale, setLocale } = useLocaleStore();

  return (
    <>
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
    </>
  );
};
