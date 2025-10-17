import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";

interface GovActionCellProps {
  id?: string;
  name?: string;
}

export const GovActionCell: FC<GovActionCellProps> = ({ id, name }) => {
  if (!id) return <span>-</span>;

  const to = {
    to: "/gov/action/$id",
    params: { id },
  };

  return (
    <div className='flex flex-col'>
      {name && (
        <Link {...to} className='text-primary'>
          {name}
        </Link>
      )}
      <div className='flex items-center gap-1'>
        <Link
          {...to}
          className={`${
            name
              ? "pointer-events-none text-text-xs text-inherit"
              : "text-text-sm text-primary"
          }`}
        >
          {formatString(id, "long")}
        </Link>
        <Copy copyText={id} size={name ? 10 : 13} />
      </div>
    </div>
  );
};
