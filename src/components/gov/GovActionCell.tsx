import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";

interface GovActionCellProps {
  id?: string;
  name?: string;
  bech?: string;
}

export const GovActionCell: FC<GovActionCellProps> = ({ id, name, bech }) => {
  if (!id) return <span>-</span>;

  const encodedId = encodeURIComponent(id);
  const displayText = bech || id;

  const to = {
    to: "/gov/action/$id",
    params: { id: encodedId },
  };

  return (
    <div className='flex flex-col'>
      {name && (
        <Link {...to} className='text-primary'>
          {name}
        </Link>
      )}
      <div className='flex items-center gap-1/2'>
        <span
          className={`overflow-hidden text-ellipsis whitespace-nowrap ${
            name ? "text-text-xs" : "text-text-sm"
          } text-grayText`}
        >
          <Link {...to} className='!text-inherit hover:!text-inherit'>
            {formatString(displayText, "long")}
          </Link>
        </span>
        <Copy copyText={id} size={name ? 10 : 13} className='stroke-grayText' />
      </div>
    </div>
  );
};
