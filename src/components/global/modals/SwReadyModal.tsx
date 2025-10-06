import type { FC } from "react";

import { RefreshCcw, X } from "lucide-react";

import parse from "html-react-parser";

import { useFetchMiscNew, useFetchMiscSW } from "@/services/misc";
import { useEffect, useState } from "react";
import Button from "../Button";

interface SwReadyModalProps {
  firstInstall: boolean;
  testMessage?: any;
  onClose?: () => void;
}

export const SwReadyModal: FC<SwReadyModalProps> = ({
  firstInstall,
  testMessage,
  onClose,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const { data } = useFetchMiscNew();
  useFetchMiscSW("done");

  const message = testMessage ? testMessage.data.en : data?.data?.message?.en;

  useEffect(() => {
    const channel = new BroadcastChannel("sw-modal");

    channel.onmessage = event => {
      if (event.data === "update-modal") {
        window.location.reload();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    setOpen(false);
  };

  const handleRefresh = () => {
    const channel = new BroadcastChannel("sw-modal");

    if ("location" in window) {
      channel.postMessage("update-modal");
    }
  };

  return (
    open && (
      <div className='fixed bottom-[10px] right-1 z-50 flex w-full max-w-[340px] flex-col gap-1.5 rounded-xl border border-border bg-background p-3 md:right-[10px]'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold'>
            Cexplorer {firstInstall ? "install" : "update"} completed 💪
          </h3>
          <X size={18} onClick={handleClose} className='cursor-pointer' />
        </div>
        {!firstInstall && (
          <div className='text-grayTextPrimary flex flex-col text-sm'>
            {parse(message || "")}
          </div>
        )}
        <div className='flex flex-col gap-1/2'>
          <span className='text-grayTextPrimary text-sm font-medium'>
            {firstInstall
              ? "Refresh the page to enjoy cexplorer!"
              : "Refresh the page to enjoy the new update."}
          </span>
          {!testMessage && (
            <Button
              size='lg'
              variant='primary'
              className='max-w-full'
              onClick={handleRefresh}
              label={
                <div className='flex w-full items-center gap-1/2'>
                  <span>Refresh page</span>
                  <RefreshCcw className='text-inherit' size={15} />
                </div>
              }
            />
          )}
        </div>
      </div>
    )
  );
};
