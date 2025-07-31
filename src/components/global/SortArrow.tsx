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
    <ArrowUpDown size={14} className='translate-y-[1px] stroke-grayText' />
  ) : direction === "asc" ? (
    <ArrowUpNarrowWide
      size={14}
      className='translate-y-[1px] stroke-grayText'
    />
  ) : (
    <ArrowDownWideNarrow
      size={14}
      className='translate-y-[1px] stroke-grayText'
    />
  );
};
