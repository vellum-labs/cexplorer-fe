import type { FC } from "react";

import { X } from "lucide-react";

import parse from "html-react-parser";

import { useFetchMiscNew, useFetchMiscSW } from "@/services/misc";
import { useEffect, useState } from "react";
import { Button } from "@vellumlabs/cexplorer-sdk";

interface SwReadyModalProps {
  testMessage?: any;
  onClose?: () => void;
}

export const SwReadyModal: FC<SwReadyModalProps> = ({
  testMessage,
  onClose,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const { data } = useFetchMiscNew();
  useFetchMiscSW("done");

  const message = testMessage ? testMessage.data.en : data?.data?.message?.en;

  const handleClose = () => {
    localStorage.removeItem("should_update");

    if (onClose) {
      onClose();
    }

    setOpen(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleClose();
    }, 20_000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    open && (
      <div className='fixed bottom-[10px] right-1 z-50 flex w-full max-w-[340px] flex-col gap-1.5 rounded-l border border-border bg-background p-3 md:right-[10px]'>
        <div className='flex items-center justify-between'>
          <h3 className='text-text-sm font-semibold'>
            Cexplorer update completed 💪
          </h3>
          <X size={18} onClick={handleClose} className='cursor-pointer' />
        </div>

        <div className='flex flex-col text-text-sm text-grayTextPrimary'>
          {parse(message || "")}
        </div>

        <div className='flex flex-col gap-1/2'>
          <span className='text-text-sm font-medium text-grayTextPrimary'>
            Please confirm that you’ve read this message.
          </span>
          {!testMessage && (
            <Button
              size='lg'
              variant='primary'
              className='max-w-full'
              onClick={handleClose}
              label='I understand'
            />
          )}
        </div>
      </div>
    )
  );
};
