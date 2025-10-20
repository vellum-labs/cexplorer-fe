import type { FC, ReactNode } from "react";

import { getColumnsSortOrder } from "@/utils/getColumnsSortOrder";
import { useNavigate } from "@tanstack/react-router";
import { SortArrow } from "@vellumlabs/cexplorer-sdk";

interface TitleSortProps {
  order?: string;
  titleOrder: string;
  sort?: "asc" | "desc";
  children: ReactNode;
}

export const TitleSort: FC<TitleSortProps> = ({
  order,
  sort,
  titleOrder,
  children,
}) => {
  const navigate = useNavigate();

  const getOrder = (orderValue: string) => {
    return getColumnsSortOrder(sort) !== undefined || order !== orderValue
      ? orderValue
      : undefined;
  };

  return (
    <div className='flex w-full justify-end'>
      <div
        className='flex w-fit cursor-pointer items-center gap-1/2 text-right'
        onClick={() => {
          navigate({
            search: {
              sort: order === titleOrder ? getColumnsSortOrder(sort) : "desc",
              order: getOrder(titleOrder),
            } as any,
          });
        }}
      >
        {children}
        <SortArrow direction={order === titleOrder ? sort : undefined} />
      </div>
    </div>
  );
};
