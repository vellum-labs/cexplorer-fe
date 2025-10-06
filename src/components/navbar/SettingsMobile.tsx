import type { FC } from "react";

import { ChevronRightIcon, Settings } from "lucide-react";

interface SettingsMobileProps {
  onClick?: () => void;
  className?: string;
}

const SettingsMobile: FC<SettingsMobileProps> = ({ onClick, className }) => {
  return (
    <button
      className={`flex w-full items-center gap-1.5 ${className}`}
      onClick={onClick}
    >
      <Settings size={20} />
      <span className='font-medium hover:underline'>Settings</span>
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
