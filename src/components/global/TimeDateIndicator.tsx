import type { FC } from "react";

import { Clock } from "lucide-react";

import DateCell from "../table/DateCell";

import { formatDate } from "@/utils/format/format";

interface TimeDateIndicatorProps {
  time: string | undefined;
}

export const TimeDateIndicator: FC<TimeDateIndicatorProps> = ({ time }) => {
  return (
    <div className='flex flex-wrap items-center gap-1 text-sm'>
      <span className='font-medium leading-none text-text'>
        <DateCell time={time} />
      </span>
      <div className='flex items-center'>
        <span className='text-grayTextPrimary text-nowrap pr-1 text-xs leading-none'>
          ({formatDate(time ? new Date(time) : undefined)})
        </span>
        <Clock size={12} className='text-grayTextPrimary h-full' />
      </div>
    </div>
  );
};
