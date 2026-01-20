import type { FC } from "react";

import { Moon, Sun } from "lucide-react";

import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const SettingsMobileItemTheme: FC = () => {
  const { t } = useAppTranslation("navigation");
  const { theme } = useThemeStore();
  const themeIcon = theme === "light" ? <Moon size={20} /> : <Sun size={20} />;

  return (
    <button className='flex w-full items-center justify-between'>
      <span className=''>{t("settings.theme")}</span>
      {themeIcon}
    </button>
  );
};
