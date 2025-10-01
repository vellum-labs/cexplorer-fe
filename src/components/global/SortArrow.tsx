import type { FC } from "react";

import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from "lucide-react";

interface SortArrowProps {
  direction: "asc" | "desc" | undefined;
}

export const SortArrow: FC<SortArrowProps> = ({ direction }) => {
  return direction === undefined ? (
    <p className='min-h-3 min-w-3'>
      {" "}
      <ArrowUpDown size={15} className='stroke-grayText translate-y-[1px]' />
    </p>
  ) : direction === "asc" ? (
    <p className='min-h-3 min-w-3'>
      <ArrowUpNarrowWide
        size={15}
        className='stroke-grayText translate-y-[1px]'
      />
    </p>
  ) : (
    <p className='min-h-3 min-w-3'>
      <ArrowDownWideNarrow
        size={15}
        className='stroke-grayText translate-y-[1px]'
      />
    </p>
  );
};
