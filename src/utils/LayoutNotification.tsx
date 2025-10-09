import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface LayoutNotificationProps {
  storeKey?: string;
  message: string;
  link?: {
    text: string;
    href: string;
  };
  startTime: Date;
  endTime: Date;
  backgroundColor: string;
  textColor: string;
}

export const LayoutNotification = ({
  storeKey,
  message,
  link,
  startTime,
  endTime,
  backgroundColor,
  textColor,
}: LayoutNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const STORAGE_KEY = storeKey || "info_navbar_default";

  useEffect(() => {
    const now = new Date();
    if (now >= startTime && now <= endTime) {
      const closed = localStorage.getItem(STORAGE_KEY);
      if (closed !== "true") {
        setIsVisible(true);
      }
    }
  }, [STORAGE_KEY, startTime, endTime]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className='flex items-center justify-center py-1.5 md:py-0'
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      <div className='relative flex w-full max-w-desktop items-center justify-center gap-1.5 px-desktop md:p-mobile'>
        <span className='ml-3 mr-3 text-center text-text-sm'>
          {message}
          {link && (
            <Link
              to={link.href}
              style={{ color: textColor }}
              className='underline'
              onClick={handleClose}
            >
              {link.text}
            </Link>
          )}
        </span>
        <button
          onClick={handleClose}
          className='absolute right-4 rounded-max p-1/2 hover:bg-white/20'
          aria-label='Close'
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
