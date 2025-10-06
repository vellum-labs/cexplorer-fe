import type { FC } from "react";

import { cn } from "@/lib/utils";

interface HardforkPageTotalCountItemProps {
  title: string;
  count: number;
  className?: string;
  wrapperClassname?: string;
  active: boolean;
  onClick?: () => void;
}

const HardforkPageTotalCountItem: FC<HardforkPageTotalCountItemProps> = ({
  title,
  count,
  className,
  wrapperClassname,
  active,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-1 rounded-s px-1.5 py-1 font-regular transition duration-300",
        active && "bg-cardBg",
        wrapperClassname,
      )}
      onClick={onClick}
    >
      <span className='text-grayTextPrimary text-nowrap text-sm'>{title}</span>
      <span
        className={cn(
          "rounded-xl border px-[10px] py-[2px] text-sm font-bold",
          className,
        )}
      >
        {count}
      </span>
    </div>
  );
};

export default HardforkPageTotalCountItem;
