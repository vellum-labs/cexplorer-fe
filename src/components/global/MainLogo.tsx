import { useThemeStore } from "@/stores/themeStore";
import { useState, useEffect } from "react";

import { Link } from "@tanstack/react-router";

import DarkLogo from "/resources/preloader_logo_dark.svg";
import LightLogo from "/resources/preloader_logo_light.svg";
import DarkLogoOffline from "/resources/logo_darkmode_offline.svg";
import LightLogoOffline from "/resources/logo_lightmode_offline.svg";
import { Badge } from "./badges/Badge";

const MainLogo = ({
  size = 150,
  onClick,
  className,
}: {
  size?: number;
  onClick?: () => void;
  className?: string;
}) => {
  const { theme } = useThemeStore();
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("online", updateOnlineStatus, { signal });
    window.addEventListener("offline", updateOnlineStatus, { signal });

    updateOnlineStatus();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Link to='/' className='shrink-0' onClick={onClick}>
      <div className='relative'>
        {isOnline ? (
          <img
            className={className}
            src={theme === "light" ? DarkLogo : LightLogo}
            width={size}
            alt='Cexplorer logo'
          />
        ) : (
          <img
            className={className}
            src={theme === "light" ? LightLogoOffline : DarkLogoOffline}
            width={size}
            alt='Cexplorer logo'
          />
        )}
        <Badge
          color='blue'
          className='absolute left-[36px] top-[31px] h-5 w-5 !px-[6px] !py-[2px] !text-[10px] !font-bold'
        >
          beta
        </Badge>
      </div>
    </Link>
  );
};

export default MainLogo;
