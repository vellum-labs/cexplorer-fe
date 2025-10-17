import type { FC } from "react";

import { Moon, Sun } from "lucide-react";

import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

export const SettingsMobileItemTheme: FC = () => {
  const { theme } = useThemeStore();
  const themeIcon = theme === "light" ? <Moon size={20} /> : <Sun size={20} />;

  return (
    <button className='flex w-full items-center justify-between'>
      <span className=''>Theme</span>
      {themeIcon}
    </button>
  );
};
