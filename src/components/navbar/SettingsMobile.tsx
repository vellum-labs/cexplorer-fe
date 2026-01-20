import type { FC } from "react";

import { ChevronRightIcon, Settings } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface SettingsMobileProps {
  onClick?: () => void;
  className?: string;
}

const SettingsMobile: FC<SettingsMobileProps> = ({ onClick, className }) => {
  const { t } = useAppTranslation("navigation");

  return (
    <button
      className={`flex w-full items-center gap-1.5 ${className}`}
      onClick={onClick}
    >
      <Settings size={20} />
      <span className='font-medium hover:underline'>
        {t("navbar.settings")}
      </span>
      <ChevronRightIcon
        height={16}
        width={16}
        className='ml-auto'
        strokeWidth={1.6}
      />
    </button>
  );
};

export default SettingsMobile;
