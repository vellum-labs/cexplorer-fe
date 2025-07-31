import type { FC } from "react";

import { X } from "lucide-react";

import { useFetchMiscSW } from "@/services/misc";
import { useEffect, useState } from "react";

interface SwUpdateModalProps {
  progress: number;
  firstInstall: boolean;
  isActivating?: boolean;
}

export const SwUpdateModal: FC<SwUpdateModalProps> = ({
  progress,
  firstInstall,
  isActivating,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const [activateProgress, setActivateProgress] = useState(0);
  useFetchMiscSW("install");

  const version = import.meta.env.VITE_APP_VERSION || 158;

  useEffect(() => {
    if (isActivating) {
      const interval = setInterval(() => {
        setActivateProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isActivating]);

  return (
    open && (
      <div className='fixed bottom-[10px] right-1 z-50 flex w-full max-w-[340px] flex-col gap-3 rounded-xl border border-border bg-background p-6 md:right-[10px]'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold'>
            {isActivating
              ? "Activating"
              : firstInstall
                ? "Installing"
                : "Upgrading"}{" "}
            Cexplorer 🎉
          </h3>
          <X
            size={18}
            onClick={() => setOpen(false)}
            className='cursor-pointer'
          />
        </div>
        <span className='text-xs text-grayTextPrimary'>
          build #{version - 1} {"->"} #{version}
        </span>
        <p className='text-sm text-grayTextPrimary'>
          {firstInstall
            ? "Features and improvements are on the way!"
            : "A new version with added features and improvements is on the way!"}
        </p>

        {isActivating ? (
          <div className='flex items-center gap-3'>
            <div className='relative h-2 w-[81%] overflow-hidden rounded-[4px] bg-[#FEC84B]'>
              <span
                className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                style={{
                  width: `${activateProgress}%`,
                }}
              ></span>
            </div>
            <span className='text-sm font-medium text-grayTextPrimary'>
              {activateProgress}%
            </span>
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <div className='relative h-2 w-[81%] overflow-hidden rounded-[4px] bg-[#FEC84B]'>
              <span
                className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                style={{
                  width: `${progress}%`,
                }}
              ></span>
            </div>
            <span className='text-sm font-medium text-grayTextPrimary'>
              {progress}%
            </span>
          </div>
        )}
      </div>
    )
  );
};
