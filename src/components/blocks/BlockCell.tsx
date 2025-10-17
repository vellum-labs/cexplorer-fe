import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";

export const BlockCell = ({ hash, no }: { hash: string; no: number }) => {
  return (
    <Link
      to='/block/$hash'
      params={{ hash: hash }}
      className='flex justify-end text-primary'
    >
      {formatNumber(no ?? 0)}
    </Link>
  );
};
