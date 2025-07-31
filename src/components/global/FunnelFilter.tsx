import type { ReactNode, RefObject } from "react";

import { createPortal } from "react-dom";
import Button from "@/components/global/Button";

import { useLayoutEffect, useState } from "react";

interface FunnelFilterProps {
  anchorRef: RefObject<HTMLElement>;
  disabled?: boolean;
  onFilter?: () => void;
  onReset?: () => void;
  children: ReactNode;
  width?: string;
}

export const FunnelFilter = ({
  anchorRef,
  children,
  disabled = false,
  width = "250px",
  onFilter,
  onReset,
}: FunnelFilterProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (!anchorRef?.current) {
      return;
    }

    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + window.scrollY - 45,
        left: rect.left + window.scrollX - 80,
      });
    }
  };

  useLayoutEffect(() => {
    updatePosition();

    const scrollListener = () => updatePosition();
    window.addEventListener("scroll", scrollListener, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", scrollListener, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return createPortal(
    <div
      className='absolute z-50 rounded-lg border border-border bg-background'
      style={{
        bottom: window.innerHeight - position.top,
        left: position.left,
        width,
      }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <div className='min-h-[50px] w-full border-b border-border'>
        {children}
      </div>
      <div className='flex h-[40px] w-full items-center justify-between px-6 py-3'>
        <Button
          size='xs'
          className='cursor-pointer px-2'
          variant='tertiary'
          label='Reset'
          onClick={onReset}
        />
        <Button
          size='xs'
          className='cursor-pointer px-2'
          variant='primary'
          label='Filter'
          disabled={disabled}
          onClick={onFilter}
        />
      </div>
    </div>,
    document.body,
  );
};
