import { useGeekConfigStore } from "@/stores/geekConfigStore";
import type { AssetOwnerAdaHandle } from "@/types/assetsTypes";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";

interface Props {
  address: string;
  adahandle?: AssetOwnerAdaHandle | null;
  className?: string;
}

export const AddressOrHandleCell = ({
  address,
  adahandle,
  className,
}: Props) => {
  const { displayHandles } = useGeekConfigStore();

  const showHandle = displayHandles && adahandle?.name;

  return (
    <div className='flex items-center gap-1'>
      <Link
        to='/address/$address'
        params={{ address }}
        className={`block overflow-hidden overflow-ellipsis whitespace-nowrap text-text-sm text-primary ${className ?? ""}`}
        title={showHandle ? address : undefined}
      >
        {showHandle ? (
          <span className='font-medium'>${adahandle.name}</span>
        ) : (
          <>
            <span className='hidden md:inline'>
              {formatString(address, "longer")}
            </span>
            <span className='md:hidden'>
              {formatString(address, "shorter")}
            </span>
          </>
        )}
      </Link>
      <Copy copyText={address} />
    </div>
  );
};
