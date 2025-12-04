import type { TxAsset } from "@/types/assetsTypes";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";

interface Props {
  asset: TxAsset;
  type: "input" | "output";
  className?: string;
}

const AssetLink = ({ asset, type, className }: Props) => {
  const divideNumber = asset.registry?.decimals
    ? 10 ** asset.registry.decimals
    : 1;
  const fingerprint = getAssetFingerprint(asset?.name);
  const adaHandlePolicy = configJSON.integration[0].adahandle[0].policy;
  const isAdaHandle = asset?.name?.includes(adaHandlePolicy);

  return (
    <Link
      to='/asset/$fingerprint'
      params={{ fingerprint: fingerprint }}
      title={fingerprint}
      key={fingerprint}
      className={`flex w-fit max-w-full rounded-s border border-border bg-background px-1 py-[1px] text-text-xs font-medium text-primary ${className}`}
    >
      <span className='flex items-center overflow-hidden text-ellipsis whitespace-nowrap'>
        {isAdaHandle && (
          <AdaHandleBadge
            variant='icon'
            className='mr-1/2 h-1.5 w-1.5 shrink-0'
            policyId={adaHandlePolicy}
          />
        )}
        {renderAssetName({ asset, fingerprint, type: "long" })}
      </span>
      <span className='ml-auto min-w-fit pl-1'>
        {`${type === "input" ? "-" : ""}${formatNumberWithSuffix(asset.quantity / divideNumber, true)}`}
      </span>
    </Link>
  );
};

export default AssetLink;
