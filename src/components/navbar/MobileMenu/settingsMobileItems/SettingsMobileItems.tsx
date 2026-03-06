import type { Dispatch, FC, ReactNode, SetStateAction } from "react";

import { Fragment } from "react";

import { ChevronLeft, CircleHelp } from "lucide-react";

import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { SettingsMobileItemTheme } from "./SettingsMobileItemTheme";
import { SettingsMobileItemLanguage } from "./SettingsMobileItemLanguage";
import { SettingsMobileItemCurrency } from "./SettingsMobileItemCurrency";
import { SettingsMobileItemScrolling } from "./SettingsMobileItemScrolling";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface SettingsMobileItemsProps {
  onBack?: () => void;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const SettingsMobileItems: FC<SettingsMobileItemsProps> = ({
  onBack,
  setOpen,
}) => {
  const { t } = useAppTranslation("navigation");
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
    {
      component: (
        <div className='flex items-center gap-2'>
          <CircleHelp size={20} />
          <span>{t("navbar.guidedTour")}</span>
        </div>
      ),
      onClick: () => {
        setOpen?.(false);
        setTimeout(() => {
          localStorage.removeItem("onboarding_tour_completed");
          window.dispatchEvent(new CustomEvent("restart-onboarding-tour"));
        }, 400);
      },
    },
  ];

  return (
    <>
      <button
        onClick={onBack}
        className='flex h-[34px] -translate-x-1 items-center gap-1 font-medium'
      >
        <ChevronLeft size={20} className='font-regular' />
        <span>{t("navbar.settings")}</span>
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
