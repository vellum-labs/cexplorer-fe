import type { FC } from "react";

import { X } from "lucide-react";

import { useFetchMiscSW } from "@/services/misc";
import { useState } from "react";
import { LoadingDots } from "@/components/global/LoadingDots";

interface SwUpdateModalProps {
  firstInstall: boolean;
}

export const SwUpdateModal: FC<SwUpdateModalProps> = ({
  firstInstall,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  useFetchMiscSW("install");

  const version = import.meta.env.VITE_APP_VERSION || 158;

  return (
    open && (
      <div className='fixed bottom-[10px] right-1 z-50 flex w-full max-w-[340px] flex-col gap-3 rounded-xl border border-border bg-background p-6 md:right-[10px]'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold'>
            {firstInstall ? "Installing" : "Upgrading"} Cexplorer 🎉
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

        <div className='flex items-center justify-center py-2'>
          <LoadingDots />
        </div>
      </div>
    )
  );
};
