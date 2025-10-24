import type { Currencies } from "@/types/storeTypes";
import type { FC } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vellumlabs/cexplorer-sdk";

import { useCurrencyStore } from "@/stores/currencyStore";

import { currencies } from "@/constants/currencies";

export const SettingsMobileItemCurrency: FC = () => {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <>
      <span>Currency</span>
      <Select
        defaultValue={currency}
        onValueChange={(value: Currencies) => {
          setCurrency(value);
        }}
      >
        <SelectTrigger className='w-[90px]'>
          <SelectValue
            placeholder={
              <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                <span>{currencies[currency].value}</span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent align='end'>
          {Object.entries(currencies).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              <div className='flex w-full items-center justify-between gap-1/2 uppercase'>
                <span>{value.value}</span>
                {/* <img width={15} height={15} alt='flag' src={value.image} /> */}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
