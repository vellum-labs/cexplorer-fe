import type { FC, ReactNode } from "react";

import { Fragment } from "react";

import { ChevronLeft } from "lucide-react";

import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { SettingsMobileItemTheme } from "./SettingsMobileItemTheme";
import { SettingsMobileItemLanguage } from "./SettingsMobileItemLanguage";
import { SettingsMobileItemCurrency } from "./SettingsMobileItemCurrency";
import { SettingsMobileItemScrolling } from "./SettingsMobileItemScrolling";

interface SettingsMobileItemsProps {
  onBack?: () => void;
}

export const SettingsMobileItems: FC<SettingsMobileItemsProps> = ({
  onBack,
}) => {
  const { toggleTheme } = useThemeStore();
  const { toggleInfiniteScrolling } = useInfiniteScrollingStore();

  const settingsMobileItems: {
    component: ReactNode;
    onClick?: () => void;
  }[] = [
    {
      component: <SettingsMobileItemTheme />,
      onClick: toggleTheme,
    },
    {
      component: <SettingsMobileItemLanguage />,
      onClick: () => undefined,
    },
    {
      component: <SettingsMobileItemCurrency />,
      onClick: () => undefined,
    },
    {
      component: <SettingsMobileItemScrolling />,
      onClick: toggleInfiniteScrolling,
    },
  ];

  return (
    <>
      <button
        onClick={onBack}
        className='flex h-[34px] -translate-x-1 items-center gap-1 font-medium'
      >
        <ChevronLeft size={20} className='font-regular' />
        <span>Settings</span>
      </button>
      <div className='h-full w-full py-1'>
        {(settingsMobileItems || []).map(({ component, onClick }, i) => (
          <Fragment key={i}>
            <div
              className='mt-1.5 flex h-[50px] w-full items-center justify-between gap-3 border-b border-border pb-1.5 font-medium'
              onClick={onClick}
            >
              {component}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
};
