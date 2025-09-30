import { useThemeStore } from "@/stores/themeStore";
import { useState, useEffect } from "react";

import { Link } from "@tanstack/react-router";

import DarkLogo from "/resources/preloader_logo_dark.svg";
import LightLogo from "/resources/preloader_logo_light.svg";
import DarkLogoOffline from "/resources/logo_darkmode_offline.svg";
import LightLogoOffline from "/resources/logo_lightmode_offline.svg";
import { Badge } from "./badges/Badge";
import { EnvironmentBadge } from "./badges/EnvironmentBadge";

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
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(window.location.origin + "/favicon.ico", {
          method: "HEAD",
          cache: "no-cache",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    const intervalId = setInterval(checkConnection, 30000);

    return () => {
      clearInterval(intervalId);
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
        <EnvironmentBadge />
      </div>
    </Link>
  );
};

export default MainLogo;
